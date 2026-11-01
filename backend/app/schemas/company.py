from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.position import PositionResponse


class CompanyCreate(BaseModel):
    company_name: str
    industry: str | None = None
    description: str | None = None
    logo_url: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    province: str | None = None
    website: str | None = None


class CompanyUpdate(BaseModel):
    company_name: str | None = None
    industry: str | None = None
    description: str | None = None
    logo_url: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    province: str | None = None
    website: str | None = None
    is_active: bool | None = None


class CompanyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    company_id: UUID
    company_name: str
    industry: str | None = None
    description: str | None = None
    logo_url: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    province: str | None = None
    website: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

class CompanyBrowseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    company_id: UUID
    company_name: str
    industry: str | None = None
    description: str | None = None
    logo_url: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    province: str | None = None
    website: str | None = None

    positions: list[PositionResponse] = Field(default_factory=list)