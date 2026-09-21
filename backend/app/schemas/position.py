from datetime import date
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PositionCreate(BaseModel):
    company_id: UUID
    position_name: str
    description: str | None = None
    requirements: list[str] | None = None
    salary: Decimal | None = Field(default=None, ge=0)
    project_topic: str | None = None
    capacity: int | None = Field(default=None, ge=1)
    start_date: date | None = None
    end_date: date | None = None
    status: str = "open"


class PositionUpdate(BaseModel):
    company_id: UUID | None = None
    position_name: str | None = None
    description: str | None = None
    requirements: list[str] | None = None
    salary: Decimal | None = Field(default=None, ge=0)
    project_topic: str | None = None
    capacity: int | None = Field(default=None, ge=1)
    start_date: date | None = None
    end_date: date | None = None
    status: str | None = None


class PositionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    position_id: UUID
    company_id: UUID
    position_name: str
    description: str | None = None
    requirements: list[str] | None = None
    salary: Decimal | None = None
    project_topic: str | None = None
    capacity: int | None = None
    start_date: date | None = None
    end_date: date | None = None
    status: str

    \ No newline at end of file