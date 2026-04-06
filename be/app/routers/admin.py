from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import analytics, institution as inst_crud
from app.crud import contact as contact_crud
from app.crud import listing_application as app_crud
from app.database import get_db
from app.deps.auth import AdminAuth
from app.models.listing_application import ApplicationStatus
from app.schemas.admin import (
    AnalyticsSummary,
    ContactMessageAdminOut,
    ContactMessageListResponse,
    ContactMessagePatch,
    InstitutionAdminCreate,
    InstitutionAdminListResponse,
    InstitutionAdminOut,
    InstitutionAdminUpdate,
    ListingApplicationAdminOut,
    ListingApplicationListResponse,
    RejectApplicationBody,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/analytics/summary", response_model=AnalyticsSummary)
async def admin_analytics_summary(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    data = await analytics.get_analytics_summary(db)
    return AnalyticsSummary(**data)


@router.get("/institutions", response_model=InstitutionAdminListResponse)
async def admin_list_institutions(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    is_active: Annotated[bool | None, Query()] = None,
    is_featured: Annotated[bool | None, Query()] = None,
    city: Annotated[str | None, Query()] = None,
    category: Annotated[str | None, Query()] = None,
    q: Annotated[str | None, Query()] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    items, total = await inst_crud.admin_list_institutions(
        db,
        is_active=is_active,
        is_featured=is_featured,
        city=city,
        category=category,
        q=q,
        page=page,
        page_size=page_size,
    )
    return InstitutionAdminListResponse(
        items=[InstitutionAdminOut.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
        has_next=(page * page_size) < total,
    )


@router.post("/institutions", response_model=InstitutionAdminOut, status_code=201)
async def admin_create_institution(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    body: InstitutionAdminCreate,
):
    row = await inst_crud.create_institution(db, body)
    return InstitutionAdminOut.model_validate(row)


@router.get("/institutions/{institution_id}", response_model=InstitutionAdminOut)
async def admin_get_institution(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    institution_id: str,
):
    row = await inst_crud.get_institution_by_id(db, institution_id)
    if not row:
        raise HTTPException(status_code=404, detail="Institution not found")
    return InstitutionAdminOut.model_validate(row)


@router.patch("/institutions/{institution_id}", response_model=InstitutionAdminOut)
async def admin_update_institution(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    institution_id: str,
    body: InstitutionAdminUpdate,
):
    row = await inst_crud.update_institution(db, institution_id, body)
    if not row:
        raise HTTPException(status_code=404, detail="Institution not found")
    return InstitutionAdminOut.model_validate(row)


@router.delete("/institutions/{institution_id}", response_model=InstitutionAdminOut)
async def admin_delete_institution(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    institution_id: str,
):
    row = await inst_crud.soft_delete_institution(db, institution_id)
    if not row:
        raise HTTPException(status_code=404, detail="Institution not found")
    return InstitutionAdminOut.model_validate(row)


@router.get("/listing-applications", response_model=ListingApplicationListResponse)
async def admin_list_applications(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    status_filter: Annotated[
        ApplicationStatus | None, Query(alias="status")
    ] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    items, total = await app_crud.list_listing_applications(
        db, status=status_filter, page=page, page_size=page_size
    )
    return ListingApplicationListResponse(
        items=[ListingApplicationAdminOut.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
        has_next=(page * page_size) < total,
    )


@router.get(
    "/listing-applications/{application_id}",
    response_model=ListingApplicationAdminOut,
)
async def admin_get_application(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    application_id: int,
):
    row = await app_crud.get_listing_application(db, application_id)
    if not row:
        raise HTTPException(status_code=404, detail="Application not found")
    return ListingApplicationAdminOut.model_validate(row)


@router.post(
    "/listing-applications/{application_id}/approve",
    response_model=InstitutionAdminOut,
    status_code=201,
)
async def admin_approve_application(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    application_id: int,
):
    inst, _app, err = await app_crud.approve_listing_application(db, application_id)
    if err == "not_found":
        raise HTTPException(status_code=404, detail="Application not found")
    if err == "not_pending":
        raise HTTPException(
            status_code=409,
            detail="Application is not pending",
        )
    assert inst is not None
    return InstitutionAdminOut.model_validate(inst)


@router.post(
    "/listing-applications/{application_id}/reject",
    response_model=ListingApplicationAdminOut,
)
async def admin_reject_application(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    application_id: int,
    body: RejectApplicationBody,
):
    row, err = await app_crud.reject_listing_application(
        db, application_id, reason=body.reason
    )
    if err == "not_found":
        raise HTTPException(status_code=404, detail="Application not found")
    if err == "not_pending":
        raise HTTPException(
            status_code=409,
            detail="Application is not pending",
        )
    assert row is not None
    return ListingApplicationAdminOut.model_validate(row)


@router.get("/contact-messages", response_model=ContactMessageListResponse)
async def admin_list_contact_messages(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    is_read: Annotated[bool | None, Query()] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    items, total = await contact_crud.list_contact_messages(
        db, is_read=is_read, page=page, page_size=page_size
    )
    return ContactMessageListResponse(
        items=[ContactMessageAdminOut.model_validate(i) for i in items],
        total=total,
        page=page,
        page_size=page_size,
        has_next=(page * page_size) < total,
    )


@router.get(
    "/contact-messages/{message_id}",
    response_model=ContactMessageAdminOut,
)
async def admin_get_contact_message(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    message_id: int,
):
    row = await contact_crud.get_contact_message(db, message_id)
    if not row:
        raise HTTPException(status_code=404, detail="Message not found")
    return ContactMessageAdminOut.model_validate(row)


@router.patch(
    "/contact-messages/{message_id}",
    response_model=ContactMessageAdminOut,
)
async def admin_patch_contact_message(
    _: AdminAuth,
    db: Annotated[AsyncSession, Depends(get_db)],
    message_id: int,
    body: ContactMessagePatch,
):
    row = await contact_crud.set_contact_message_read(
        db, message_id, is_read=body.is_read
    )
    if not row:
        raise HTTPException(status_code=404, detail="Message not found")
    return ContactMessageAdminOut.model_validate(row)
