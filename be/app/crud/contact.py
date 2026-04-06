from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact import ContactMessage
from app.models.listing_application import ListingApplication
from app.schemas.contact import ContactCreate
from app.schemas.listing_application import ListingApplicationCreate


async def create_contact_message(db: AsyncSession, data: ContactCreate) -> ContactMessage:
    record = ContactMessage(**data.model_dump())
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record


async def create_listing_application(db: AsyncSession, data: ListingApplicationCreate) -> ListingApplication:
    record = ListingApplication(**data.model_dump())
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record


async def list_contact_messages(
    db: AsyncSession,
    *,
    is_read: bool | None = None,
    page: int = 1,
    page_size: int = 20,
):
    query = select(ContactMessage)
    if is_read is not None:
        query = query.where(ContactMessage.is_read == is_read)

    count_query = select(func.count()).select_from(query.subquery())
    total = int(await db.scalar(count_query) or 0)

    offset = (page - 1) * page_size
    query = query.order_by(ContactMessage.created_at.desc()).offset(offset).limit(page_size)
    result = await db.execute(query)
    items = list(result.scalars().all())
    return items, total


async def get_contact_message(db: AsyncSession, message_id: int) -> ContactMessage | None:
    result = await db.execute(select(ContactMessage).where(ContactMessage.id == message_id))
    return result.scalar_one_or_none()


async def set_contact_message_read(
    db: AsyncSession,
    message_id: int,
    *,
    is_read: bool,
) -> ContactMessage | None:
    row = await get_contact_message(db, message_id)
    if not row:
        return None
    row.is_read = is_read
    await db.commit()
    await db.refresh(row)
    return row