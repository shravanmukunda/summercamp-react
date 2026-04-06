import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.institution import Institution
from app.models.listing_application import ApplicationStatus, ListingApplication


async def list_listing_applications(
    db: AsyncSession,
    *,
    status: ApplicationStatus | None = None,
    page: int = 1,
    page_size: int = 20,
):
    query = select(ListingApplication)
    if status is not None:
        query = query.where(ListingApplication.status == status)

    count_query = select(func.count()).select_from(query.subquery())
    total = int(await db.scalar(count_query) or 0)

    offset = (page - 1) * page_size
    query = (
        query.order_by(ListingApplication.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    result = await db.execute(query)
    items = list(result.scalars().all())
    return items, total


async def get_listing_application(
    db: AsyncSession,
    application_id: int,
) -> ListingApplication | None:
    result = await db.execute(
        select(ListingApplication).where(ListingApplication.id == application_id)
    )
    return result.scalar_one_or_none()


async def approve_listing_application(
    db: AsyncSession,
    application_id: int,
) -> tuple[Institution | None, ListingApplication | None, str | None]:
    """Create institution and mark application approved. Returns (institution, app, error)."""
    app_row = await get_listing_application(db, application_id)
    if not app_row:
        return None, None, "not_found"
    if app_row.status != ApplicationStatus.pending:
        return None, app_row, "not_pending"

    inst_id = str(uuid.uuid4())
    if app_row.address and app_row.address.strip():
        area = app_row.address.strip()[:100]
    else:
        area = app_row.city or "General"

    desc_parts: list[str] = []
    if app_row.message and app_row.message.strip():
        desc_parts.append(app_row.message.strip())
    if app_row.date_established:
        desc_parts.append(f"Established: {app_row.date_established.isoformat()}")
    if app_row.address and app_row.address.strip():
        desc_parts.append(f"Address: {app_row.address.strip()}")
    description = "\n\n".join(desc_parts) if desc_parts else None

    fac_raw = app_row.facilities or []
    if fac_raw and all(isinstance(x, str) for x in fac_raw):
        inst_facilities: list[object] = [{"name": s} for s in fac_raw]
    else:
        inst_facilities = list(fac_raw)

    inst = Institution(
        id=inst_id,
        name=app_row.academy_name,
        category=app_row.category,
        city=app_row.city,
        area=area,
        rating=0.0,
        review_count=0,
        description=description,
        image_url=None,
        is_featured=False,
        is_active=True,
        programs=[],
        facilities=inst_facilities,
    )
    db.add(inst)
    app_row.status = ApplicationStatus.approved
    app_row.rejection_reason = None
    await db.commit()
    await db.refresh(inst)
    await db.refresh(app_row)
    return inst, app_row, None


async def reject_listing_application(
    db: AsyncSession,
    application_id: int,
    *,
    reason: str,
) -> tuple[ListingApplication | None, str | None]:
    app_row = await get_listing_application(db, application_id)
    if not app_row:
        return None, "not_found"
    if app_row.status != ApplicationStatus.pending:
        return app_row, "not_pending"

    app_row.status = ApplicationStatus.rejected
    app_row.rejection_reason = reason
    await db.commit()
    await db.refresh(app_row)
    return app_row, None
