from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.contact import create_listing_application
from app.database import get_db
from app.schemas.listing_application import (
    ListingApplicationCreate,
    ListingApplicationResponse,
)

router = APIRouter(prefix="/api/listing-applications", tags=["listings"])


@router.post("", response_model=ListingApplicationResponse, status_code=201)
async def submit_listing_application(
    data: ListingApplicationCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    record = await create_listing_application(db, data)
    return ListingApplicationResponse(id=record.id)