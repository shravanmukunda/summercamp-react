from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import institution as crud
from app.crud import institution_media as media_crud
from app.database import get_db
from app.services.media_urls import build_institution_detail_public
from app.schemas.institution import (
    InstitutionCard,
    InstitutionDetail,
    InstitutionFilters,
    InstitutionListResponse,
)

router = APIRouter(prefix="/api/institutions", tags=["institutions"])


@router.get("", response_model=InstitutionListResponse)
async def list_institutions(
    db: Annotated[AsyncSession, Depends(get_db)],
    category: Annotated[str | None, Query()] = None,
    city: Annotated[str | None, Query()] = None,
    area: Annotated[str | None, Query()] = None,
    q: Annotated[str | None, Query()] = None,
    min_rating: Annotated[float | None, Query()] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=50)] = 12,
):
    filters = InstitutionFilters(
        category=category, city=city, area=area,
        q=q, min_rating=min_rating,
        page=page, page_size=page_size
    )
    items, total = await crud.get_institutions(db, filters)
    
    return InstitutionListResponse(
        items=[InstitutionCard.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
        has_next=(page * page_size) < total,
    )


@router.get("/{institution_id}", response_model=InstitutionDetail)
async def get_institution(
    institution_id: str,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    inst = await crud.get_institution_by_id(db, institution_id, only_active=True)
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    media_rows = await media_crud.list_for_institution(db, institution_id)
    return build_institution_detail_public(inst, media_rows)