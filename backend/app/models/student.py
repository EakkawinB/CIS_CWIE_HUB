from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.advisor_assignment import AdvisorStudentAssignment


class Student(Base):
    __tablename__ = "students"

    # NOTE: the physical primary key of public.students is the integer `id`.
    # `student_id` is the human readable student code (e.g. 6504062663117).
    id = Column(
        Integer,
        primary_key=True,
    )

    student_id = Column(String(20), unique=True)

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id"),
        unique=True,
        nullable=True,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
    )

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)

    major = Column(String(100))
    year = Column(Integer)
    gpax = Column(Float)
    phone = Column(String(50))

    is_active = Column(
        Boolean,
        default=True,
    )

    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.company_id"),
        nullable=True,
    )

    created_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True))

    user = relationship("User", backref="student")
    company = relationship("Company", back_populates="students")

    advisor_assignments = relationship(
        "AdvisorStudentAssignment",
        back_populates="student",
        foreign_keys=[AdvisorStudentAssignment.student_id],
    )