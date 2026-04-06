from datetime import date, datetime
from typing import ClassVar

from pydantic import BaseModel, ConfigDict, Field

from app.models.listing_application import ApplicationStatus


class AnalyticsSummary(BaseModel):
    institutions_total: int
    institutions_active: int
    institutions_featured: int
    applications_pending: int
    applications_approved: int
    applications_rejected: int
    contact_messages_total: int
    contact_messages_unread: int


class InstitutionAdminCreate(BaseModel):
    id: str | None = Field(
        default=None,
        description="Omit to auto-generate UUID string",
    )
    name: str
    category: str
    city: str
    area: str = ""
    rating: float = 0.0
    review_count: int = 0
    description: str | None = None
    image_url: str | None = None
    is_featured: bool = False
    is_active: bool = True
    programs: list[object] = Field(default_factory=list)
    facilities: list[object] = Field(default_factory=list)


class InstitutionAdminUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    city: str | None = None
    area: str | None = None
    rating: float | None = None
    review_count: int | None = None
    description: str | None = None
    image_url: str | None = None
    is_featured: bool | None = None
    is_active: bool | None = None
    programs: list[object] | None = None
    facilities: list[object] | None = None


class InstitutionAdminOut(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(from_attributes=True)

    id: str
    name: str
    category: str
    city: str
    area: str
    rating: float
    review_count: int
    description: str | None = None
    image_url: str | None = None
    is_featured: bool = False
    is_active: bool = True
    programs: list[object] = Field(default_factory=list)
    facilities: list[object] = Field(default_factory=list)


class InstitutionAdminListResponse(BaseModel):
    items: list[InstitutionAdminOut]
    total: int
    page: int
    page_size: int
    has_next: bool


class ListingApplicationAdminOut(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(from_attributes=True)

    id: int
    academy_name: str
    contact_name: str
    email: str
    phone: str
    city: str
    category: str
    date_established: date | None = None
    address: str | None = None
    facilities: list[object] = Field(default_factory=list)
    message: str | None = None
    website_url: str | None = None
    status: ApplicationStatus
    rejection_reason: str | None = None
    created_at: datetime | None = None


class ListingApplicationListResponse(BaseModel):
    items: list[ListingApplicationAdminOut]
    total: int
    page: int
    page_size: int
    has_next: bool


class RejectApplicationBody(BaseModel):
    reason: str = Field(..., min_length=1, max_length=2000)


class ContactMessageAdminOut(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    message: str
    is_read: bool = False
    created_at: datetime | None = None


class ContactMessageListResponse(BaseModel):
    items: list[ContactMessageAdminOut]
    total: int
    page: int
    page_size: int
    has_next: bool


class ContactMessagePatch(BaseModel):
    is_read: bool
