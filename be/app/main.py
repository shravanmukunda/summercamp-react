from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import admin, contact, institutions, institution_media, listing_application

app = FastAPI(
    title="SummerCamp API",
    version="0.1.0",
    docs_url="/docs" if settings.environment == "development" else None,
)

# CORS — allow your React dev server and production domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(institutions.router)
app.include_router(contact.router)
app.include_router(listing_application.router)
app.include_router(admin.router)
app.include_router(institution_media.router)

@app.get("/health")
async def health():
    return {"status": "ok"}