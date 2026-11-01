from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict


class StaffProfileResponse(BaseModel):
    staff_id: UUID
    user_id: Optional[UUID] = None

    first_name: str
    last_name: str

    department: Optional[str] = None
    phone: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)