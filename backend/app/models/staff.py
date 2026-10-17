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
from sqlalchemy.orm import relationship
from sqlalchemy import text
=======
# models/staff.py

import uuid
from sqlalchemy import Column, ForeignKey, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
>>>>>>> origin/su

from app.database import Base


class Staff(Base):
<<<<<<< HEAD

    __tablename__ = "staffs"
=======
    __tablename__ = "staff"
>>>>>>> origin/su

    staff_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
<<<<<<< HEAD
        server_default=text("gen_random_uuid()")
=======
        default=uuid.uuid4
>>>>>>> origin/su
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id"),
<<<<<<< HEAD
        unique=True,
        nullable=True
    )

    first_name = Column(
        String(100),
=======
        nullable=False,
        unique=True
    )

    name = Column(String(100))

    email = Column(
        String(255),
        unique=True,
>>>>>>> origin/su
        nullable=False
    )

    department = Column(String(100))

<<<<<<< HEAD
    department = Column(
        String(150)
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
        back_populates="staff"
=======
    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    user = relationship(
        "User",
        backref="staff"
>>>>>>> origin/su
    )