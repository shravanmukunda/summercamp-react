from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from app.config import settings


async def verify_admin_token(
    authorization: Annotated[str | None, Header()] = None,
) -> None:
    if not settings.admin_api_key.strip():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin API is not configured (set ADMIN_API_KEY).",
        )
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header.",
        )
    token = authorization[7:].strip()
    if token != settings.admin_api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid credentials.",
        )


AdminAuth = Annotated[None, Depends(verify_admin_token)]
