# models/student.py

import uuid
from sqlalchemy import Column, ForeignKey, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Student(Base):
    __tablename__ = "student"

    student_id = Column(
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

    student_code = Column(String(20), unique=True)

    name = Column(String(100))

    email = Column(
        String(255),
        unique=True,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

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
    )

    advisor_assignments = relationship(
        "AdvisorStudentAssignment",
        back_populates="student"
    )