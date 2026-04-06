from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact import ContactMessage
from app.models.institution import Institution
from app.models.listing_application import ApplicationStatus, ListingApplication


async def get_analytics_summary(db: AsyncSession):
    institutions_total = int(
        await db.scalar(select(func.count()).select_from(Institution)) or 0
    )
    institutions_active = int(
        await db.scalar(
            select(func.count())
            .select_from(Institution)
            .where(Institution.is_active == True)  # noqa: E712
        )
        or 0
    )
    institutions_featured = int(
        await db.scalar(
            select(func.count())
            .select_from(Institution)
            .where(Institution.is_featured == True)  # noqa: E712
        )
        or 0
    )
    applications_pending = int(
        await db.scalar(
            select(func.count())
            .select_from(ListingApplication)
            .where(ListingApplication.status == ApplicationStatus.pending)
        )
        or 0
    )
    applications_approved = int(
        await db.scalar(
            select(func.count())
            .select_from(ListingApplication)
            .where(ListingApplication.status == ApplicationStatus.approved)
        )
        or 0
    )
    applications_rejected = int(
        await db.scalar(
            select(func.count())
            .select_from(ListingApplication)
            .where(ListingApplication.status == ApplicationStatus.rejected)
        )
        or 0
    )
    contact_messages_total = int(
        await db.scalar(select(func.count()).select_from(ContactMessage)) or 0
    )
    contact_messages_unread = int(
        await db.scalar(
            select(func.count())
            .select_from(ContactMessage)
            .where(ContactMessage.is_read == False)  # noqa: E712
        )
        or 0
    )

    return {
        "institutions_total": institutions_total,
        "institutions_active": institutions_active,
        "institutions_featured": institutions_featured,
        "applications_pending": applications_pending,
        "applications_approved": applications_approved,
        "applications_rejected": applications_rejected,
        "contact_messages_total": contact_messages_total,
        "contact_messages_unread": contact_messages_unread,
    }
