from sqlalchemy import (
    Column,
    Integer,
    String,
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

    # 'student' | 'advisor' | 'mentor' | 'staff'
    role = Column(
        String(20),
        nullable=False
    )

    otp_hash = Column(
        String,
        nullable=False
    )

    expired_at = Column(
        DateTime(timezone=True),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )