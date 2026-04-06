from typing import ClassVar

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        # Ignore unknown .env keys (e.g. R2_API_TOKEN) so extras don’t crash startup.
        extra="ignore",
    )

    database_url: str
    secret_key: str
    frontend_origin: str = "http://localhost:5173"
    environment: str = "development"
    # Bearer token for /api/admin/* (set in production; required for admin routes)
    admin_api_key: str = ""

    # Cloudflare R2 (S3-compatible). Leave empty to disable uploads; public reads still need public URL.
    r2_endpoint_url: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = ""
    # Public origin for objects, e.g. https://pub-xxxxx.r2.dev or your custom domain (no trailing slash)
    r2_public_base_url: str = ""
    # Cloudflare Image Resizing base, e.g. https://yourdomain.com/cdn-cgi/image — used for WebP variants
    r2_image_transform_base: str = ""

    @property
    def r2_enabled(self) -> bool:
        return bool(
            self.r2_endpoint_url.strip()
            and self.r2_access_key_id.strip()
            and self.r2_secret_access_key.strip()
            and self.r2_bucket_name.strip()
            and self.r2_public_base_url.strip()
        )


settings = Settings()  # pyright: ignore[reportCallIssue] — values loaded from env / .env