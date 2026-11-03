from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime
)
from sqlalchemy.orm import synonym

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

    # 'student' | 'advisor' | 'mentor' | 'staff' | 'admin'
    role = Column(
        String(20),
        nullable=False
    )

    # Physical column in public.otp_codes is `otp_hash`.
    # `otp` is kept as a synonym so the existing OTP service keeps working
    # unchanged (it only writes this value as an audit log; verification
    # itself happens against Redis).
    otp_hash = Column(
        String,
        nullable=False
    )

    otp = synonym("otp_hash")

    failed_attempts = Column(
        Integer,
        nullable=False,
        default=0,
        server_default="0"
    )

    is_locked = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false"
    )

    expired_at = Column(
        DateTime(timezone=True),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )