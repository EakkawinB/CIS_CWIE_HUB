from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    document_type: str | None = None
    file_url: str | None = None
    status: str
    comments: str | None = None
    uploaded_at: datetime | None = None
    updated_at: datetime | None = None


class DocumentListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    document_type: str | None = None
    status: str
    uploaded_at: datetime | None = None


class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    document_type: str
    status: str
    uploaded_at: datetime | None = None


class ResumeDownloadResponse(BaseModel):
    download_url: str
    expires_in_seconds: int
