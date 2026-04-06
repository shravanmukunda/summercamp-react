from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.crud import institution as inst_crud
from app.crud import institution_media as media_crud
from app.deps.auth import AdminAuth
from app.database import get_db
from app.models.institution_media import MediaKind
from app.schemas.institution_media import (
    InstitutionMediaAdminItem,
    InstitutionMediaListResponse,
    MediaConfirmIn,
    MediaPresignIn,
    MediaPresignOut,
)
from app.services import r2_storage
from app.services.media_urls import _media_item_public

router = APIRouter(
    prefix="/api/admin/institutions/{institution_id}/media",
    tags=["admin-media"],
)

IMAGE_TYPES = frozenset({"image/jpeg", "image/png", "image/webp"})
VIDEO_TYPES = frozenset({"video/mp4", "video/webm"})
MAX_IMAGE = 30 * 1024 * 1024
MAX_VIDEO = 500 * 1024 * 1024


def _key_ok(institution_id: str, key: str) -> bool:
    prefix = f"institutions/{institution_id}/"
    return key.startswith(prefix) and ".." not in key


def _admin_item_from_row(row) -> InstitutionMediaAdminItem:
    item = _media_item_public(row)
    kind_val = row.kind.value if isinstance(row.kind, MediaKind) else str(row.kind)
    return InstitutionMediaAdminItem(
        id=item.id,
        kind=kind_val,
        url=item.url,
        webp_url=item.webp_url,
        video_poster_url=item.video_poster_url,
        video_poster_webp_url=item.video_poster_webp_url,
    )


@router.get("", response_model=InstitutionMediaListResponse)
async def list_institution_media(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    institution_id: str,
):
    inst = await inst_crud.get_institution_by_id(db, institution_id)
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    rows = await media_crud.list_for_institution(db, institution_id)
    items: list[InstitutionMediaAdminItem] = []
    for row in rows:
        if row.kind == MediaKind.poster:
            url = r2_storage.public_url_for_key(row.object_key)
            webp = r2_storage.webp_transform_url(url, 1200)
            items.append(
                InstitutionMediaAdminItem(
                    id=row.id,
                    kind="poster",
                    url=url,
                    webp_url=webp,
                    video_poster_url=None,
                    video_poster_webp_url=None,
                )
            )
        else:
            items.append(_admin_item_from_row(row))
    return InstitutionMediaListResponse(items=items)


@router.post("/presign", response_model=MediaPresignOut)
async def presign_upload(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    institution_id: str,
    body: MediaPresignIn,
):
    if not settings.r2_enabled:
        raise HTTPException(
            status_code=503,
            detail="Media uploads are not configured (R2 environment variables).",
        )
    inst = await inst_crud.get_institution_by_id(db, institution_id)
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")

    ct = body.content_type.lower().strip()
    if body.kind in ("poster", "photo", "video_poster"):
        if ct not in IMAGE_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Images must be image/jpeg, image/png, or image/webp",
            )
        if body.file_size > MAX_IMAGE:
            raise HTTPException(status_code=400, detail="Image too large")
    elif body.kind == "video":
        if ct not in VIDEO_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Video must be video/mp4 or video/webm",
            )
        if body.file_size > MAX_VIDEO:
            raise HTTPException(status_code=400, detail="Video too large")
    else:
        raise HTTPException(status_code=400, detail="Invalid kind")

    subfolder = "posters" if body.kind == "video_poster" else None
    key = r2_storage.build_object_key(institution_id, body.filename, subfolder=subfolder)
    upload_url = r2_storage.presigned_put_url(key, ct)
    return MediaPresignOut(
        upload_url=upload_url,
        object_key=key,
        headers={"Content-Type": ct},
    )


@router.post("/confirm", response_model=InstitutionMediaAdminItem)
async def confirm_upload(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    institution_id: str,
    body: MediaConfirmIn,
):
    if not settings.r2_enabled:
        raise HTTPException(status_code=503, detail="R2 not configured")
    inst = await inst_crud.get_institution_by_id(db, institution_id)
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")

    if not _key_ok(institution_id, body.object_key):
        raise HTTPException(status_code=400, detail="Invalid object key")

    if body.kind == "video" and body.poster_object_key:
        if not _key_ok(institution_id, body.poster_object_key):
            raise HTTPException(status_code=400, detail="Invalid poster object key")
        if "/posters/" not in body.poster_object_key:
            raise HTTPException(
                status_code=400,
                detail="Video poster must be uploaded with presign kind=video_poster",
            )

    if body.kind == "poster":
        old = await media_crud.fetch_posters(db, institution_id)
        for r in old:
            try:
                r2_storage.delete_object(r.object_key)
            except Exception:
                pass
        await media_crud.delete_posters_db(db, institution_id)
        row = await media_crud.create_media(
            db,
            institution_id=institution_id,
            kind=MediaKind.poster,
            object_key=body.object_key,
            poster_key=None,
            sort_order=0,
        )
        url = r2_storage.public_url_for_key(row.object_key)
        webp = r2_storage.webp_transform_url(url, 1200)
        return InstitutionMediaAdminItem(
            id=row.id,
            kind="poster",
            url=url,
            webp_url=webp,
            video_poster_url=None,
            video_poster_webp_url=None,
        )

    if body.kind == "photo":
        so = await media_crud.next_sort_order(db, institution_id)
        row = await media_crud.create_media(
            db,
            institution_id=institution_id,
            kind=MediaKind.photo,
            object_key=body.object_key,
            poster_key=None,
            sort_order=so,
        )
        return _admin_item_from_row(row)

    if body.kind == "video":
        so = await media_crud.next_sort_order(db, institution_id)
        poster_key = body.poster_object_key
        row = await media_crud.create_media(
            db,
            institution_id=institution_id,
            kind=MediaKind.video,
            object_key=body.object_key,
            poster_key=poster_key,
            sort_order=so,
        )
        return _admin_item_from_row(row)

    raise HTTPException(status_code=400, detail="Unsupported kind")


@router.delete("/{media_id}", status_code=204)
async def delete_institution_media(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    institution_id: str,
    media_id: int,
):
    if not settings.r2_enabled:
        raise HTTPException(status_code=503, detail="R2 not configured")
    row = await media_crud.get_by_id(db, institution_id, media_id)
    if not row:
        raise HTTPException(status_code=404, detail="Media not found")
    try:
        r2_storage.delete_object(row.object_key)
    except Exception:
        pass
    if row.poster_key:
        try:
            r2_storage.delete_object(row.poster_key)
        except Exception:
            pass
    await media_crud.delete_media_instance(db, row)
    return Response(status_code=204)
