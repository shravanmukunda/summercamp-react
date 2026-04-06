from typing import ClassVar, Literal

from pydantic import BaseModel, ConfigDict, Field


class InstitutionMediaItem(BaseModel):
    id: int
    kind: Literal["photo", "video"]
    url: str
    webp_url: str | None = None
    video_poster_url: str | None = None
    video_poster_webp_url: str | None = None

# What the API returns in the list view (lightweight)
class InstitutionCard(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(from_attributes=True)

    id: str
    name: str
    category: str
    city: str
    area: str
    rating: float
    review_count: int
    image_url: str | None = None
    is_featured: bool = False

# What the API returns for the detail view (full)
class InstitutionDetail(InstitutionCard):
    description: str | None = None
    programs: list[object] = Field(default_factory=list)
    facilities: list[object] = Field(default_factory=list)
    poster_url: str | None = None
    poster_webp_url: str | None = None
    media: list[InstitutionMediaItem] = Field(default_factory=list)

# Query params for filtering
class InstitutionFilters(BaseModel):
    category: str | None = None
    city: str | None = None
    area: str | None = None
    q: str | None = None  # text search
    min_rating: float | None = None
    page: int = 1
    page_size: int = 12

# Paginated list response
class InstitutionListResponse(BaseModel):
    items: list[InstitutionCard]
    total: int
    page: int
    page_size: int
    has_next: bool