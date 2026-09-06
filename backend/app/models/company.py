from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    String,
    func,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    company_id = Column(
        UUID(as_uuid=True),
        primary_key=True
    )

    company_name = Column(
        String,
        nullable=False
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