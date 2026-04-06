from datetime import date

from pydantic import BaseModel, EmailStr, Field, field_validator


class ListingApplicationCreate(BaseModel):
    academy_name: str
    contact_name: str
    email: EmailStr
    phone: str
    city: str
    category: str
    date_established: date
    address: str = Field(..., min_length=1, max_length=4000)
    facilities: list[str] = Field(..., min_length=1)
    message: str | None = None
    website_url: str | None = None

    @field_validator("address")
    @classmethod
    def strip_address(cls, v: str) -> str:
        return v.strip()

    @field_validator("facilities", mode="before")
    @classmethod
    def normalize_facilities(cls, v: object) -> list[str]:
        if isinstance(v, list):
            return [s.strip() for s in v if isinstance(s, str) and s.strip()]
        return []

class ListingApplicationResponse(BaseModel):
    id: int
    message: str = "Application received. We'll review and reach out within 12 hours."