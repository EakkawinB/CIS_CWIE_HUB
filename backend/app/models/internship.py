import uuid
from datetime import datetime, date
from sqlalchemy import Column, ForeignKey, String, Date, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Internship(Base):
    __tablename__ = "internships"

    internship_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student.student_id"),
        nullable=False
    )

    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.company_id"),
        nullable=False
    )

    mentor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("mentor.mentor_id"),
        nullable=True
    )

    position = Column(String(100))

    start_date = Column(Date)

    end_date = Column(Date)

    status = Column(
        String(50),
        default="active"
    )

    notes = Column(Text)

    created_at = Column(
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
        backref="internships"
    )

    company = relationship(
        "Company",
        backref="internships"
    )

    mentor = relationship(
        "Mentor",
        backref="internships"
    )
