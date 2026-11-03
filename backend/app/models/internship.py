import uuid
from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, func
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

    application_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student_applications.application_id"),
        nullable=False,
        unique=True,
    )

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    position_id = Column(
        UUID(as_uuid=True),
        ForeignKey("positions.position_id"),
        nullable=False,
    )

    status = Column(
        String(50),
        default="placed"
    )

    start_date = Column(Date)

    end_date = Column(Date)

    placed_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    closed_at = Column(DateTime(timezone=True))

    closed_by_staff_id = Column(
        UUID(as_uuid=True),
        ForeignKey("staffs.staff_id"),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    student = relationship(
        "Student",
        backref="internships"
    )

    position = relationship(
        "Position",
        foreign_keys=[position_id],
    )

    application = relationship(
        "StudentApplication",
        back_populates="internship",
        uselist=False,
    )
