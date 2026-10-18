import uuid
from datetime import datetime
from sqlalchemy import Column, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class AdvisorStudentAssignment(Base):
    __tablename__ = "advisor_student_assignments"

    assignment_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    advisor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("advisors.advisor_id"),
        nullable=False
    )

    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student.student_id"),
        nullable=False
    )

    assigned_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    advisor = relationship(
        "Advisor",
        back_populates="advisor_student_assignments"
    )

    student = relationship(
        "Student",
        backref="advisor_assignments"
    )
