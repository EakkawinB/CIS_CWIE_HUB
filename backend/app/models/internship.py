import uuid
from datetime import datetime, date
from sqlalchemy import Column, Date, DateTime, ForeignKey, String, Text
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
        nullable=True
    )

    mentor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("mentor.mentor_id"),
        nullable=True
    )

    application_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student_applications.application_id"),
        nullable=True,
        unique=True,
    )

    position_id = Column(
        UUID(as_uuid=True),
        ForeignKey("positions.position_id"),
        nullable=True,
    )

    position = Column(String(100))

    start_date = Column(Date)

    end_date = Column(Date)

    status = Column(
        String(50),
        default="active"
    )

    notes = Column(Text)
    placed_at = Column(DateTime)
    closed_at = Column(DateTime)
    closed_by_staff_id = Column(
        UUID(as_uuid=True),
        ForeignKey("staff.staff_id"),
        nullable=True,
    )

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

    application = relationship(
        "StudentApplication",
        back_populates="internship",
        uselist=False,
    )

    role_position = relationship(
        "Position",
        foreign_keys=[position_id],
    )
