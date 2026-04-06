from __future__ import annotations

import uuid
from urllib.parse import quote

import boto3
from botocore.client import BaseClient
from botocore.config import Config

from app.config import settings


def _client() -> BaseClient:
    return boto3.client(
        "s3",
        endpoint_url=settings.r2_endpoint_url,
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )


def build_object_key(
    institution_id: str,
    original_filename: str,
    *,
    subfolder: str | None = None,
) -> str:
    safe = "".join(c for c in original_filename if c.isalnum() or c in "._-")
    if not safe:
        safe = "file"
    uid = uuid.uuid4().hex[:12]
    base = f"institutions/{institution_id}"
    if subfolder:
        base = f"{base}/{subfolder.strip('/')}"
    return f"{base}/{uid}-{safe}"


def presigned_put_url(key: str, content_type: str, *, expires_in: int = 3600) -> str:
    return _client().generate_presigned_url(
        "put_object",
        Params={
            "Bucket": settings.r2_bucket_name,
            "Key": key,
            "ContentType": content_type,
        },
        ExpiresIn=expires_in,
        HttpMethod="PUT",
    )


def delete_object(key: str) -> None:
    _client().delete_object(Bucket=settings.r2_bucket_name, Key=key)


def public_url_for_key(key: str) -> str:
    base = settings.r2_public_base_url.rstrip("/")
    return f"{base}/{key.lstrip('/')}"


def webp_transform_url(source_url: str, width: int) -> str | None:
    """Cloudflare Image Resizing: /cdn-cgi/image/<options>/<SOURCE_URL>."""
    base = settings.r2_image_transform_base.strip().rstrip("/")
    if not base:
        return None
    opts = f"width={width},format=webp"
    encoded = quote(source_url, safe="")
    return f"{base}/{opts}/{encoded}"
