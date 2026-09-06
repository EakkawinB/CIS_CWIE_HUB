from uuid import UUID
from typing import Optional
from pydantic import BaseModel, ConfigDict


class StudentProfileResponse(BaseModel):
    id: int
    user_id: Optional[UUID] = None
    student_id: Optional[str] = None

    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None

    major: Optional[str] = None
    year: Optional[int] = None
    gpax: Optional[float] = None

    company_id: Optional[UUID] = None
    is_active: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)

class StudentProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

    model_config = ConfigDict(extra="forbid")