from sqlalchemy import Boolean, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Institution(Base):
    __tablename__: str = "institutions"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50))  # "sports", "music", etc.
    city: Mapped[str] = mapped_column(String(100))
    area: Mapped[str] = mapped_column(String(100))
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    programs: Mapped[list[object]] = mapped_column(JSONB, default=list)
    facilities: Mapped[list[object]] = mapped_column(JSONB, default=list)

    media_items: Mapped[list["InstitutionMedia"]] = relationship(  # noqa: F821
        "InstitutionMedia",
        back_populates="institution",
        cascade="all, delete-orphan",
    )

