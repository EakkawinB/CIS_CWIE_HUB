import uuid
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Advisor(Base):
    __tablename__ = "advisors"

    advisor_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id"),
        nullable=False,
        unique=True
    )

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)

    department = Column(String(100))
    phone = Column(String(50))

    created_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True))

    user = relationship(
        "User",
        backref="advisor"
    )

    advisor_student_assignments = relationship(
        "AdvisorStudentAssignment",
        back_populates="advisor"
    )
