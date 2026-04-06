import enum
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base


class MediaKind(str, enum.Enum):
    poster = "poster"
    photo = "photo"
    video = "video"


class InstitutionMedia(Base):
    __tablename__: str = "institution_media"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    institution_id: Mapped[str] = mapped_column(
        String(200), ForeignKey("institutions.id", ondelete="CASCADE"), index=True
    )
    kind: Mapped[MediaKind] = mapped_column(
        SAEnum(
            MediaKind,
            values_callable=lambda e: [i.value for i in e],
            native_enum=False,
            name="institution_media_kind",
        ),
        nullable=False,
    )
    object_key: Mapped[str] = mapped_column(String(1024), nullable=False)
    poster_key: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    institution: Mapped["Institution"] = relationship(  # noqa: F821
        "Institution", back_populates="media_items"
    )
