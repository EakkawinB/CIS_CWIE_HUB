<<<<<<< HEAD
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    func
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text
=======
import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
>>>>>>> origin/su

from app.database import Base

from sqlalchemy.orm import relationship


class User(Base):

    __tablename__ = "users"

    user_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
<<<<<<< HEAD
        server_default=text("gen_random_uuid()")
    )
    
=======
        default=uuid.uuid4,
        index=True
    )

>>>>>>> origin/su
    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    role = Column(
<<<<<<< HEAD
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
=======
        String(50),
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
>>>>>>> origin/su
    )