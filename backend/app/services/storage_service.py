from supabase import create_client, Client

from app.config import settings


def _create_storage_client() -> Client:
    if not settings.SUPABASE_URL or not settings.SUPABASE_URL.strip():
        raise RuntimeError(
            "Missing required Storage setting: SUPABASE_URL"
        )

    if (
        not settings.SUPABASE_SECRET_KEY
        or not settings.SUPABASE_SECRET_KEY.strip()
    ):
        raise RuntimeError(
            "Missing required Storage setting: SUPABASE_SECRET_KEY"
        )

    if (
        not settings.SUPABASE_STORAGE_BUCKET
        or not settings.SUPABASE_STORAGE_BUCKET.strip()
    ):
        raise RuntimeError(
            "Missing required Storage setting: SUPABASE_STORAGE_BUCKET"
        )

    try:
        return create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SECRET_KEY
        )
    except Exception:
        raise RuntimeError(
            "Unable to initialize Supabase Storage client"
        ) from None


def upload_file(
    file_path: str,
    file_content: bytes,
    content_type: str,
    upsert: bool = True
) -> str:
    supabase = _create_storage_client()

    supabase.storage.from_(
        settings.SUPABASE_STORAGE_BUCKET
    ).upload(
        path=file_path,
        file=file_content,
        file_options={
            "content-type": content_type,
            "upsert": "true" if upsert else "false"
        }
    )

    return file_path

def delete_file(file_path: str) -> None:
    supabase = _create_storage_client()

    supabase.storage.from_(
        settings.SUPABASE_STORAGE_BUCKET
    ).remove([file_path])


def create_signed_download_url(
    file_path: str,
    expires_in_seconds: int = 60
) -> str:
    supabase = _create_storage_client()
    response = supabase.storage.from_(
        settings.SUPABASE_STORAGE_BUCKET
    ).create_signed_url(file_path, expires_in_seconds)

    if not isinstance(response, dict):
        raise RuntimeError("Unable to create signed Storage URL")

    signed_url = (
        response.get("signedURL")
        or response.get("signedUrl")
        or response.get("signed_url")
    )
    if not signed_url:
        raise RuntimeError("Unable to create signed Storage URL")

    return signed_url
