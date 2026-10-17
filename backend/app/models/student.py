# models/student.py

import uuid
from sqlalchemy import Column, ForeignKey, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Student(Base):
    __tablename__ = "student"

    # เชื่อมกับบัญชีกลาง
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id"),
        unique=True,
        nullable=True   # ชั่วคราวระหว่าง migration
    )

    student_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

<<<<<<< HEAD
    # เก็บชั่วคราวจนกว่า Auth ใหม่จะเสร็จ
    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    phone = Column(
        String(30),
        nullable=True
    )

    first_name = Column(
        String(100),
=======
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id"),
        unique=True,
        nullable=False
    )

    student_code = Column(String(20), unique=True)

    name = Column(String(100))

    email = Column(
        String(255),
        unique=True,
>>>>>>> origin/su
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

<<<<<<< HEAD
    major = Column(String)
    year = Column(Integer)
    gpax = Column(Float)

=======
>>>>>>> origin/su
    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.company_id"),
        nullable=True
    ) 

    user = relationship(
        "User",
        backref="student"
    )

    company = relationship(
        "Company",
        back_populates="students"
<<<<<<< HEAD
    )

    documents = relationship(
        "Document",
        back_populates="student"
    )

    # User relationship
    user = relationship(
        "User",
        back_populates="student"
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
=======
>>>>>>> origin/su
    )