import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Position(Base):
    __tablename__ = "positions"

    position_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    position_name = Column(
        String(100),
        nullable=False
    )

    description = Column(String)

    department = Column(String(100))
