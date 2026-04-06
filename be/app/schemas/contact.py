from typing import ClassVar

from pydantic import BaseModel, ConfigDict, EmailStr


class ContactCreate(BaseModel):
    model_config: ClassVar[ConfigDict] = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Arjun Kumar",
                "email": "arjun@example.com",
                "message": "I'd like to know more about cricket academies in Bangalore.",
            }
        }
    )

    name: str
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    id: int
    message: str = "Your message has been received. We'll get back to you shortly."