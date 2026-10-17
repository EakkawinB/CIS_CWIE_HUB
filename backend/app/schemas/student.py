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
