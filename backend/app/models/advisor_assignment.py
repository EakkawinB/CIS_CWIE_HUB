from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    PrimaryKeyConstraint,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class AdvisorStudentAssignment(Base):
    __tablename__ = "advisor_student_assignments"
    __table_args__ = (
        PrimaryKeyConstraint(
            "assignment_id",
            name="advisor_student_assignments_pkey",
        ),
        UniqueConstraint(
            "student_id",
            name="uq_advisor_student_assignments_student_id",
        ),
        Index(
            "ix_advisor_student_assignments_advisor_id",
            "advisor_id",
        ),
    )

    assignment_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    student_id = Column(
        Integer,
        ForeignKey(
            "students.id",
            name="advisor_student_assignments_student_id_fkey",
        ),
        nullable=False,
    )
    advisor_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "advisors.advisor_id",
            name="advisor_student_assignments_advisor_id_fkey",
        ),
        nullable=False,
    )
    assigned_by_staff_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "staffs.staff_id",
            name="advisor_student_assignments_assigned_by_staff_id_fkey",
        ),
        nullable=False,
    )
    assigned_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    student = relationship("Student")
    advisor = relationship("Advisor")
    assigned_by_staff = relationship("Staff")
