<<<<<<< HEAD
from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    func,
    text
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text
from sqlalchemy.orm import relationship

from app.database import Base


class Mentor(Base):

    __tablename__ = "mentors"

    mentor_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id"),
        unique=True,
        nullable=False
    )

    first_name = Column(
        String(100),
        nullable=False
    )

    last_name = Column(
        String(100),
        nullable=False
    )

    phone = Column(
        String(30)
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )

    user = relationship(
        "User",
        back_populates="mentor"
=======
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
>>>>>>> origin/su
    )