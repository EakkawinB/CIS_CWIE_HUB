from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


ACTIVE_APPLICATION_STATUSES = (
    "applied",
    "interview_scheduled",
    "waiting_result",
)
APPLICATION_STATUSES = ACTIVE_APPLICATION_STATUSES + (
    "accepted",
    "rejected",
)


class StudentApplication(Base):
    __tablename__ = "student_applications"
    __table_args__ = (
        CheckConstraint(
            "status IN ('applied', 'interview_scheduled', "
            "'waiting_result', 'accepted', 'rejected')",
            name="ck_student_applications_status",
        ),
        UniqueConstraint(
            "application_id",
            "student_id",
            "position_id",
            name="uq_student_applications_identity",
        ),
        Index(
            "uq_student_applications_one_active_per_student",
            "student_id",
            unique=True,
            postgresql_where=text(
                "status IN ('applied', 'interview_scheduled', 'waiting_result')"
            ),
        ),
        Index("ix_student_applications_student_id", "student_id"),
        Index("ix_student_applications_position_id", "position_id"),
        Index("ix_student_applications_status", "status"),
    )

    application_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False,
    )
    position_id = Column(
        UUID(as_uuid=True),
        ForeignKey("positions.position_id"),
        nullable=False,
    )
    status = Column(
        String(30),
        nullable=False,
        default="applied",
        server_default="applied",
    )

    interview_at = Column(DateTime(timezone=True), nullable=True)
    interview_channel = Column(String(20), nullable=True)
    interview_location = Column(String, nullable=True)
    interview_details = Column(Text, nullable=True)
    interview_attended = Column(Boolean, nullable=True)
    interview_completed_at = Column(DateTime(timezone=True), nullable=True)

    rejection_reason = Column(Text, nullable=True)
    outcome_recorded_by = Column(
        UUID(as_uuid=True),
        ForeignKey("staffs.staff_id"),
        nullable=True,
    )
    outcome_recorded_at = Column(DateTime(timezone=True), nullable=True)

    applied_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
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

    student = relationship("Student")
    position = relationship("Position")
    outcome_staff = relationship("Staff")
    internship = relationship(
        "Internship",
        back_populates="application",
        uselist=False,
    )
