import random
import string
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.redis import get_redis
from app.models.otp import OTPCode
from app.services.email_service import get_email_service


OTP_TTL = 300  # 5 นาที


def _key(email: str, role: str) -> str:
    return f"otp:{role}:{email}"


def _generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


async def create_otp(email: str, role: str, db: Session) -> str:
    """
    สร้าง OTP
    - เก็บใน Redis (primary) TTL 5 นาที
    - บันทึกใน DB (audit log)
    - ส่ง OTP ผ่าน email
    """
    redis = await get_redis()
    otp = _generate_otp()

    # เก็บใน Redis
    await redis.setex(_key(email, role), OTP_TTL, otp)

    # บันทึกใน DB เป็น audit log
    record = OTPCode(
        email=email,
        role=role,
        otp=otp,
        expired_at=datetime.now(timezone.utc) + timedelta(seconds=OTP_TTL)
    )
    db.add(record)
    db.commit()

    # ส่ง email ผ่าน Mailpit
    email_service = get_email_service()
    send_success = await email_service.send_otp_email(email, otp, role)
    
    if not send_success:
        print(f"⚠️ Warning: Could not send OTP email to {email}, but OTP was created")

    return otp


async def verify_otp(email: str, role: str, otp: str) -> bool:
    """
    ตรวจสอบ OTP จาก Redis
    - ถูกต้อง → ลบออกจาก Redis ทันที (ใช้ได้ครั้งเดียว)
    - ผิด / หมดอายุ → return False
    """
    redis = await get_redis()
    stored = await redis.get(_key(email, role))

    if not stored or stored != otp:
        return False

    await redis.delete(_key(email, role))
    return True


async def revoke_otp(email: str, role: str):
    """ยกเลิก OTP ก่อนหมดอายุ เช่น กรณีขอ OTP ใหม่"""
    redis = await get_redis()
    await redis.delete(_key(email, role))