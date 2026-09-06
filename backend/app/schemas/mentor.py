from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict


class MentorProfileResponse(BaseModel):
    mentor_id: UUID
    user_id: UUID

    first_name: str
    last_name: str

    phone: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)