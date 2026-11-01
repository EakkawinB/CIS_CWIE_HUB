from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

from jose import jwt, JWTError

from app.config import settings


def create_access_token(
    profile_id: str,
    email: str,
    role: str
) -> str:
    """
    สร้าง JWT access token
    
    Args:
        profile_id: UUID ของ profile (student_id, teacher_id, staff_id)
        email: อีเมลของผู้ใช้
        role: บทบาทของผู้ใช้ (student, teacher, staff)
    
    Returns:
        str: JWT token
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(profile_id),
        "email": email,
        "role": role,
        "iat": datetime.now(timezone.utc),
        "exp": expire
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return token


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    ตรวจสอบ JWT token
    
    Args:
        token: JWT token string
    
    Returns:
        Dict: Payload หรือ None ถ้า token ไม่ถูกต้อง
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError as e:
        print(f"❌ JWT Error: {str(e)}")
        return None


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Alias for verify_token for backward compatibility"""
    return verify_token(token)