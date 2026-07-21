from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime
)

from sqlalchemy.sql import func

from app.database import Base


class OTPCode(Base):

    __tablename__ = "otp_codes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(
        String,
        nullable=False,
        index=True
    )

    # 'student' | 'teacher' | 'staff'
    role = Column(
        String(20),
        nullable=False
    )

    otp = Column(
        String,
        nullable=False
    )

    is_used = Column(
        Boolean,
        default=False
    )

    expired_at = Column(
        DateTime,
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )