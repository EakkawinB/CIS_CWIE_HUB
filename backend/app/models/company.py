from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    String,
    Text,
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

import uuid

from app.database import Base


class Company(Base):

    __tablename__ = "companies"

    company_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    company_name = Column(
        String,
        nullable=False
    )

    email = Column(
        String
    )

    phone = Column(
        String
    )

    address = Column(
        String
    )

    province = Column(String)
    website = Column(String)
    industry = Column(String)
    description = Column(Text)
    logo_url = Column(String)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    students = relationship(
        "Student",
        back_populates="company"
    )
    positions = relationship(
        "Position",
        back_populates="company"
    )