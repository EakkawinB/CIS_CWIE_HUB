from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    func
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text

from app.database import Base

from sqlalchemy.orm import relationship


class User(Base):

    __tablename__ = "users"

    user_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )
    
    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    role = Column(
        String(20),
        nullable=False
    )

    status = Column(
        String(20),
        nullable=False,
        default="pending"
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )

    student = relationship(
        "Student",
        back_populates="user",
        uselist=False
    )

    advisor = relationship(
        "Advisor",
        back_populates="user",
        uselist=False
    )

    mentor = relationship(
        "Mentor",
        back_populates="user",
        uselist=False
    )

    staff = relationship(
        "Staff",
        back_populates="user",
        uselist=False
    )