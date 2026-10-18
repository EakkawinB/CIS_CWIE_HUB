import uuid
from sqlalchemy import Column, ForeignKey, String, Boolean
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

    name = Column(String(100))

    email = Column(
        String(255),
        unique=True,
        nullable=False
    )

    department = Column(String(100))

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    user = relationship(
        "User",
        backref="advisor"
    )

    advisor_student_assignments = relationship(
        "AdvisorStudentAssignment",
        back_populates="advisor"
    )
