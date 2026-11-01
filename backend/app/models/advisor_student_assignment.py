import uuid
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class AdvisorStudentAssignment(Base):
    __tablename__ = "advisor_student_assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("students.student_id"),
        nullable=False,
    )

    # แก้ชื่อตาราง/คอลัมน์ให้ตรงกับโมเดล advisor จริงของคุณ
    advisor_id = Column(
        UUID(as_uuid=True),
        ForeignKey("advisors.advisor_id"),
        nullable=False,
    )

    student = relationship("Student", back_populates="advisor_assignments")
    advisor = relationship("Advisor", back_populates="student_assignments")