from __future__ import annotations

from app.models.institution import Institution
from app.models.institution_media import InstitutionMedia, MediaKind
from app.schemas.institution import InstitutionDetail, InstitutionMediaItem
from app.services import r2_storage


def _media_item_public(row: InstitutionMedia) -> InstitutionMediaItem:
    url = r2_storage.public_url_for_key(row.object_key)
    video_poster_url = None
    video_poster_webp_url = None
    if row.kind == MediaKind.video:
        webp_url = None
        if row.poster_key:
            video_poster_url = r2_storage.public_url_for_key(row.poster_key)
            video_poster_webp_url = r2_storage.webp_transform_url(video_poster_url, 800)
    else:
        webp_url = r2_storage.webp_transform_url(url, 1200)
    return InstitutionMediaItem(
        id=row.id,
        kind=row.kind.value,  # photo | video
        url=url,
        webp_url=webp_url,
        video_poster_url=video_poster_url,
        video_poster_webp_url=video_poster_webp_url,
    )


def build_institution_detail_public(
    inst: Institution,
    media_rows: list[InstitutionMedia],
) -> InstitutionDetail:
    base = InstitutionDetail.model_validate(inst)
    poster_row = next((m for m in media_rows if m.kind == MediaKind.poster), None)
    poster_url = None
    poster_webp_url = None
    if poster_row:
        poster_url = r2_storage.public_url_for_key(poster_row.object_key)
        poster_webp_url = r2_storage.webp_transform_url(poster_url, 1920) or poster_url

    gallery_rows = [
        m for m in media_rows if m.kind in (MediaKind.photo, MediaKind.video)
    ]
    gallery_rows.sort(key=lambda m: (m.sort_order, m.id))

    return base.model_copy(
        update={
            "poster_url": poster_url,
            "poster_webp_url": poster_webp_url,
            "media": [_media_item_public(m) for m in gallery_rows],
        }
    )
