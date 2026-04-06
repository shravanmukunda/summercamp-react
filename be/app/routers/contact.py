from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.contact import create_contact_message
from app.database import get_db
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter(prefix="/api/contact", tags=["contact"])

# Background task — runs after response is sent, user doesn't wait
def send_notification_email(email: str, name: str):
    # Add your email logic here (e.g. smtplib, sendgrid)
    print(f"[EMAIL] New contact from {name} <{email}>")

@router.post("", response_model=ContactResponse, status_code=201)
async def submit_contact(
    data: ContactCreate,
    background_tasks: BackgroundTasks,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    record = await create_contact_message(db, data)
    
    # Non-blocking — response goes out first, email sends after
    background_tasks.add_task(send_notification_email, data.email, data.name)
    
    return ContactResponse(id=record.id)