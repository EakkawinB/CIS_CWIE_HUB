import uuid
from datetime import datetime
from sqlalchemy import Column, ForeignKey, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class StudentApplication(Base):
    __tablename__ = "student_applications"

    application_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student.student_id"),
        nullable=False
    )

    position_id = Column(
        UUID(as_uuid=True),
        ForeignKey("positions.position_id"),
        nullable=False
    )

    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.company_id"),
        nullable=False
    )

    status = Column(
        String(50),
        default="pending"
    )

    cover_letter = Column(Text)

    applied_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    student = relationship(
        "Student",
        backref="applications"
    )

    position = relationship(
        "Position",
        backref="applications"
    )

    company = relationship(
        "Company",
        backref="applications"
    )
