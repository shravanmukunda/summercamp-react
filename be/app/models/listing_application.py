import enum
from datetime import date

from sqlalchemy import Date, DateTime, Enum as SAEnum, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class ApplicationStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class ListingApplication(Base):
    __tablename__: str = "listing_applications"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    academy_name: Mapped[str] = mapped_column(String(200))
    contact_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(200))
    phone: Mapped[str] = mapped_column(String(20))
    city: Mapped[str] = mapped_column(String(100))
    category: Mapped[str] = mapped_column(String(50))
    message: Mapped[str] = mapped_column(Text, nullable=True)
    website_url: Mapped[str] = mapped_column(String(500), nullable=True)
    date_established: Mapped[date | None] = mapped_column(Date, nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    facilities: Mapped[list[object]] = mapped_column(JSONB, default=list)
    status: Mapped[ApplicationStatus] = mapped_column(
        SAEnum(ApplicationStatus), default=ApplicationStatus.pending
    )
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())