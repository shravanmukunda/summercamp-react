from typing import ClassVar, Literal

from pydantic import BaseModel, ConfigDict, Field


PresignKind = Literal["poster", "photo", "video", "video_poster"]


class MediaPresignIn(BaseModel):
    kind: PresignKind
    filename: str = Field(..., min_length=1, max_length=255)
    content_type: str = Field(..., min_length=3, max_length=120)
    file_size: int = Field(..., ge=1, le=600 * 1024 * 1024)


class MediaPresignOut(BaseModel):
    upload_url: str
    object_key: str
    headers: dict[str, str]


class MediaConfirmIn(BaseModel):
    kind: Literal["poster", "photo", "video"]
    object_key: str = Field(..., min_length=8, max_length=1024)
    poster_object_key: str | None = Field(
        default=None,
        max_length=1024,
        description="For video: optional thumbnail image key (uploaded via presign kind=video_poster)",
    )


class InstitutionMediaAdminItem(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(from_attributes=True)

    id: int
    kind: str
    url: str
    webp_url: str | None = None
    video_poster_url: str | None = None
    video_poster_webp_url: str | None = None


class InstitutionMediaListResponse(BaseModel):
    items: list[InstitutionMediaAdminItem]
