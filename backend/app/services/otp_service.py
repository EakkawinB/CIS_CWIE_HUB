import secrets
import string
import hmac
import hashlib

from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.otp import OTPCode
from app.config import settings

OTP_TTL = 600  # 10 นาที


def _generate_otp(length: int = 6) -> str:
    return "".join(secrets.choice(string.digits)
    for _ in range(length))

def _hash_otp(otp: str) -> str:
    return hmac.new(
        settings.SECRET_KEY.encode(),
        otp.encode(),
        hashlib.sha256
    ).hexdigest()

async def create_otp(email: str, role: str, db: Session) -> str:
    """
    สร้าง OTP และเก็บลง Database
    """

    otp = _generate_otp()
    otp_hash = _hash_otp(otp)

    # ทำให้ OTP เก่าของ email + role ใช้ไม่ได้
    db.query(OTPCode).filter(
        OTPCode.email == email,
        OTPCode.role == role
    ).delete()

    record = OTPCode(
        email=email,
        role=role,
        otp_hash=otp_hash,
        expired_at=datetime.now(timezone.utc) + timedelta(seconds=OTP_TTL)
    )

    db.add(record)
    db.commit()

    #คืน otp จริงเพื่อเอาไปส่ง email
    return otp


async def verify_otp(
    email: str,
    role: str,
    otp: str,
    db: Session
) -> str:
    """
    ตรวจสอบ OTP จาก Database
    """

    record = db.query(OTPCode).filter(
        OTPCode.email == email,
        OTPCode.role == role
    ).first()

    print("RECORD FOUND:", record is not None)

    if not record:
        return "invalid"

    print("EXPIRED_AT:", record.expired_at)
    print("NOW:", datetime.now(timezone.utc))

    # เช็กหมดอายุก่อน
    if record.expired_at < datetime.now(timezone.utc):
        print("RESULT: EXPIRED")
        return "expired"

    incoming_hash = _hash_otp(otp)

    print(
        "HASH MATCH:",
        hmac.compare_digest(
            incoming_hash,
            record.otp_hash
        )
    )

    if not hmac.compare_digest(
        incoming_hash,
        record.otp_hash
    ):
        print("RESULT: INVALID")
        return "invalid"

    db.delete(record)
    db.commit()

    print("RESULT: SUCCESS")
    return "success"

async def revoke_otp(
    email: str,
    role: str,
    db: Session
):
    """
    ยกเลิก OTP เดิม
    """

    db.query(OTPCode).filter(
        OTPCode.email == email,
        OTPCode.role == role
    ).delete()

    db.commit()
