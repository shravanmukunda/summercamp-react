import uuid

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.institution import Institution
from app.schemas.admin import InstitutionAdminCreate, InstitutionAdminUpdate
from app.schemas.institution import InstitutionFilters


async def get_institutions(db: AsyncSession, filters: InstitutionFilters):
    query = select(Institution).where(Institution.is_active == True)
    
    if filters.category:
        query = query.where(Institution.category == filters.category)
    if filters.city:
        query = query.where(Institution.city == filters.city)
    if filters.area:
        query = query.where(Institution.area == filters.area)
    if filters.min_rating:
        query = query.where(Institution.rating >= filters.min_rating)
    if filters.q:
        query = query.where(
            or_(
                Institution.name.ilike(f"%{filters.q}%"),
                Institution.description.ilike(f"%{filters.q}%"),
            )
        )
    
    # Count total for pagination
    count_query = select(func.count()).select_from(query.subquery())
    total = int(await db.scalar(count_query) or 0)

    # Apply pagination
    offset = (filters.page - 1) * filters.page_size
    query = query.offset(offset).limit(filters.page_size)

    result = await db.execute(query)
    items = list(result.scalars().all())

    return items, total

async def get_institution_by_id(
    db: AsyncSession,
    institution_id: str,
    *,
    only_active: bool = False,
):
    q = select(Institution).where(Institution.id == institution_id)
    if only_active:
        q = q.where(Institution.is_active == True)
    result = await db.execute(q)
    return result.scalar_one_or_none()


async def admin_list_institutions(
    db: AsyncSession,
    *,
    is_active: bool | None = None,
    is_featured: bool | None = None,
    city: str | None = None,
    category: str | None = None,
    q: str | None = None,
    page: int = 1,
    page_size: int = 20,
):
    query = select(Institution)
    if is_active is not None:
        query = query.where(Institution.is_active == is_active)
    if is_featured is not None:
        query = query.where(Institution.is_featured == is_featured)
    if city:
        query = query.where(Institution.city == city)
    if category:
        query = query.where(Institution.category == category)
    if q:
        query = query.where(
            or_(
                Institution.name.ilike(f"%{q}%"),
                Institution.description.ilike(f"%{q}%"),
                Institution.area.ilike(f"%{q}%"),
            )
        )

    count_query = select(func.count()).select_from(query.subquery())
    total = int(await db.scalar(count_query) or 0)

    offset = (page - 1) * page_size
    query = query.order_by(Institution.name).offset(offset).limit(page_size)

    result = await db.execute(query)
    items = list(result.scalars().all())
    return items, total


async def create_institution(db: AsyncSession, data: InstitutionAdminCreate) -> Institution:
    inst_id = data.id or str(uuid.uuid4())
    row = Institution(
        id=inst_id,
        name=data.name,
        category=data.category,
        city=data.city,
        area=data.area,
        rating=data.rating,
        review_count=data.review_count,
        description=data.description,
        image_url=data.image_url,
        is_featured=data.is_featured,
        is_active=data.is_active,
        programs=list(data.programs),
        facilities=list(data.facilities),
    )
    db.add(row)
    await db.commit()
    await db.refresh(row)
    return row


async def update_institution(
    db: AsyncSession,
    institution_id: str,
    data: InstitutionAdminUpdate,
) -> Institution | None:
    inst = await get_institution_by_id(db, institution_id)
    if not inst:
        return None
    patch = data.model_dump(exclude_unset=True)
    for key, value in patch.items():
        setattr(inst, key, value)
    await db.commit()
    await db.refresh(inst)
    return inst


async def soft_delete_institution(db: AsyncSession, institution_id: str) -> Institution | None:
    inst = await get_institution_by_id(db, institution_id)
    if not inst:
        return None
    inst.is_active = False
    await db.commit()
    await db.refresh(inst)
    return inst