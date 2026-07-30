import uuid
from sqlalchemy import Column, ForeignKey, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Mentor(Base):
    __tablename__ = "mentor"

    mentor_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id"),
        unique=True,
        nullable=False
    )

    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.company_id"),
        nullable=False
    )

    name = Column(String(100))

    email = Column(
        String(255),
        unique=True,
        nullable=False
    )

    position = Column(String(100))

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    user = relationship(
        "User",
        backref="mentor"
    )

    company = relationship(
        "Company",
        backref="mentors"
    )