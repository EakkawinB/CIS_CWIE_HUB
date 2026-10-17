from sqlalchemy import (
    Boolean,
    Column,
<<<<<<< HEAD
    DateTime,
    String,
    Text,
    func,
)
=======
    String
)

from sqlalchemy.dialects.postgresql import UUID
>>>>>>> origin/su
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

import uuid

from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    company_id = Column(
        UUID(as_uuid=True),
<<<<<<< HEAD
        primary_key=True
=======
        primary_key=True,
        default=uuid.uuid4
>>>>>>> origin/su
    )

    company_name = Column(
        String,
        nullable=False
    )

    industry = Column(
        String,
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )

    logo_url = Column(
        String,
        nullable=True
    )

    email = Column(
        String,
        nullable=True
    )

    phone = Column(
        String,
        nullable=True
    )

    address = Column(
        String,
        nullable=True
    )

    province = Column(
        String,
        nullable=True
    )

    website = Column(
        String,
        nullable=True
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    students = relationship(
        "Student",
        back_populates="company"
    )

    # Company 1:N Position
    positions = relationship(
        "Position",
        back_populates="company"
    )