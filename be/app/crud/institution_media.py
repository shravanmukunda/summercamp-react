from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.institution_media import InstitutionMedia, MediaKind


async def list_for_institution(
    db: AsyncSession, institution_id: str
) -> list[InstitutionMedia]:
    q = (
        select(InstitutionMedia)
        .where(InstitutionMedia.institution_id == institution_id)
        .order_by(InstitutionMedia.sort_order, InstitutionMedia.id)
    )
    result = await db.execute(q)
    return list(result.scalars().all())


async def fetch_posters(
    db: AsyncSession, institution_id: str
) -> list[InstitutionMedia]:
    q = select(InstitutionMedia).where(
        InstitutionMedia.institution_id == institution_id,
        InstitutionMedia.kind == MediaKind.poster,
    )
    result = await db.execute(q)
    return list(result.scalars().all())


async def delete_posters_db(
    db: AsyncSession, institution_id: str
) -> None:
    await db.execute(
        delete(InstitutionMedia).where(
            InstitutionMedia.institution_id == institution_id,
            InstitutionMedia.kind == MediaKind.poster,
        )
    )
    await db.commit()


async def next_sort_order(db: AsyncSession, institution_id: str) -> int:
    q = select(func.coalesce(func.max(InstitutionMedia.sort_order), -1)).where(
        InstitutionMedia.institution_id == institution_id
    )
    max_so = await db.scalar(q)
    return int(max_so) + 1


async def create_media(
    db: AsyncSession,
    *,
    institution_id: str,
    kind: MediaKind,
    object_key: str,
    poster_key: str | None,
    sort_order: int,
) -> InstitutionMedia:
    row = InstitutionMedia(
        institution_id=institution_id,
        kind=kind,
        object_key=object_key,
        poster_key=poster_key,
        sort_order=sort_order,
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


async def get_by_id(
    db: AsyncSession, institution_id: str, media_id: int
) -> InstitutionMedia | None:
    q = select(InstitutionMedia).where(
        InstitutionMedia.id == media_id,
        InstitutionMedia.institution_id == institution_id,
    )
    result = await db.execute(q)
    return result.scalar_one_or_none()


async def delete_media_instance(db: AsyncSession, row: InstitutionMedia) -> None:
    await db.execute(delete(InstitutionMedia).where(InstitutionMedia.id == row.id))
    await db.commit()
