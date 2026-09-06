from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    func
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import text
from sqlalchemy.orm import relationship

from app.database import Base


class Advisor(Base):

    __tablename__ = "advisors"

    advisor_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id"),
        unique=True,
        nullable=False
    )

    first_name = Column(
        String(100),
        nullable=False
    )

    last_name = Column(
        String(100),
        nullable=False
    )

    department = Column(
        String(150)
    )

    phone = Column(
        String(30)
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )

    user = relationship(
        "User",
        back_populates="advisor"
    )