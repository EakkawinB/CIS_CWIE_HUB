from sqlalchemy import (
    CheckConstraint,
    Column,
    Date,
    DateTime,
    ForeignKey,
    ForeignKeyConstraint,
    Integer,
    String,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


INTERNSHIP_STATUSES = ("placed", "closed")


class Internship(Base):
    __tablename__ = "internships"
    __table_args__ = (
        ForeignKeyConstraint(
            ["application_id", "student_id", "position_id"],
            [
                "student_applications.application_id",
                "student_applications.student_id",
                "student_applications.position_id",
            ],
            name="fk_internships_matching_application",
        ),
        UniqueConstraint(
            "application_id",
            name="uq_internships_application_id",
        ),
        UniqueConstraint(
            "student_id",
            name="uq_internships_student_id",
        ),
        CheckConstraint(
            "status IN ('placed', 'closed')",
            name="ck_internships_status",
        ),
        CheckConstraint(
            "start_date IS NULL OR end_date IS NULL OR end_date >= start_date",
            name="ck_internships_date_range",
        ),
        CheckConstraint(
            "(status = 'placed' AND closed_at IS NULL "
            "AND closed_by_staff_id IS NULL) OR "
            "(status = 'closed' AND closed_at IS NOT NULL "
            "AND closed_by_staff_id IS NOT NULL)",
            name="ck_internships_closure_metadata",
        ),
    )

    internship_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    application_id = Column(UUID(as_uuid=True), nullable=False)
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
        String(20),
        nullable=False,
        default="placed",
        server_default="placed",
    )
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    placed_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    closed_at = Column(DateTime(timezone=True), nullable=True)
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

    application = relationship(
        "StudentApplication",
        back_populates="internship",
        foreign_keys=[application_id, student_id, position_id],
    )
    student = relationship(
        "Student",
        foreign_keys=[student_id],
        overlaps="application,internship",
    )
    position = relationship(
        "Position",
        foreign_keys=[position_id],
        overlaps="application,internship",
    )
    closed_by_staff = relationship("Staff", foreign_keys=[closed_by_staff_id])
