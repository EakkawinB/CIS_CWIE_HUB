from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.student import Student
from app.models.staff import Staff
from app.models.advisor import Advisor
from app.models.mentor import Mentor
from app.models.user import User

from app.schemas.auth import OTPRequest, OTPVerify

from app.services.otp_service import create_otp, verify_otp, EmailDeliveryError
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.core.rbac import (
    ROLE_ADMIN,
    ROLE_ADVISOR,
    ROLE_MENTOR,
    ROLE_STAFF,
    ROLE_STUDENT,
    normalize_role,
    permissions_for_role,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def _profile_for_role(db: Session, role: str, user: User):
    """
    หา profile row ของ role ที่ระบุจาก user ที่ login อยู่
    ใช้ user_id เป็นหลัก และ fallback เป็น email สำหรับนักศึกษา
    """
    if role == ROLE_STUDENT:
        student = db.query(Student).filter(
            Student.user_id == user.user_id
        ).first()
        if student is None:
            student = db.query(Student).filter(
                Student.email == user.email
            ).first()
        return student

    if role == ROLE_ADVISOR:
        return db.query(Advisor).filter(
            Advisor.user_id == user.user_id
        ).first()

    if role == ROLE_MENTOR:
        return db.query(Mentor).filter(
            Mentor.user_id == user.user_id
        ).first()

    if role == ROLE_STAFF:
        return db.query(Staff).filter(
            Staff.user_id == user.user_id
        ).first()

    return None


def _profile_id(role: str, profile) -> Optional[str]:
    """คืนค่า profile_id ที่ใช้เป็น JWT subject ของแต่ละ role"""
    if role == ROLE_STUDENT:
        student_code = getattr(profile, "student_id", None)
        if student_code:
            return str(student_code)
        return str(profile.id)

    if role == ROLE_ADVISOR:
        return str(profile.advisor_id)

    if role == ROLE_MENTOR:
        return str(profile.mentor_id)

    if role == ROLE_STAFF:
        return str(profile.staff_id)

    return None


def _lookup_role(email: str, db: Session) -> Optional[tuple[str, str]]:
    """
    หา role และ profile_id จาก email

    role มาจาก users.role ซึ่งเป็นแหล่งข้อมูลฝั่ง server ที่เชื่อถือได้
    (ไม่รับ role จาก client) และถูก normalize เพื่อรองรับข้อมูลเดิม
    return (role, profile_id) หรือ None ถ้าไม่เจอ
    """
    user = db.query(User).filter(
        User.email == email,
        User.is_active == True
    ).first()

    if user is None:
        return None

    role = normalize_role(user.role)
    if role is None:
        return None

    # admin ไม่มี profile table แยก ใช้ user_id เป็น subject
    if role == ROLE_ADMIN:
        return ROLE_ADMIN, str(user.user_id)

    profile = _profile_for_role(db, role, user)
    if profile is None:
        return None

    profile_id = _profile_id(role, profile)
    if profile_id is None:
        return None

    return role, profile_id


@router.post("/request-otp")
async def request_otp(
    data: OTPRequest,
    db: Session = Depends(get_db)
):
    """
    ขอ OTP สำหรับการเข้าสู่ระบบ
    
    Args:
        data: OTPRequest ที่มี email
        db: Database session
    
    Returns:
        dict: ข้อมูลการส่ง OTP
    """
    result = _lookup_role(data.email, db)

    if not result:
        raise HTTPException(
            status_code=403,
            detail="ไม่มีสิทธิ์เข้าใช้งานระบบ"
        )

    role, _ = result

    try:
        otp = await create_otp(
            email=data.email,
            role=role,
            db=db
        )
    except EmailDeliveryError as e:
        # Resend ไม่ยอมรับคำขอส่งอีเมล: คืนค่า error ไม่ให้ frontend แจ้งว่าส่งสำเร็จ
        raise HTTPException(
            status_code=502,
            detail="ไม่สามารถส่งอีเมล OTP ได้ กรุณาลองใหม่ภายหลัง",
        ) from e

    # ✓ OTP ถูกส่งผ่าน Resend API แล้ว (create_otp จะยกเลิก OTP หากส่งอีเมลล้มเหลว)

    return {
        "message": "ส่ง OTP แล้ว กรุณาตรวจสอบอีเมลของคุณ",
        "success": True,
        "role": role,
        "email": data.email
    }


@router.post("/verify-otp")
async def verify_otp_route(
    data: OTPVerify,
    db: Session = Depends(get_db)
):
    """
    ตรวจสอบ OTP และสร้าง JWT token
    
    Args:
        data: OTPVerify ที่มี email และ otp
        db: Database session
    
    Returns:
        dict: JWT token และข้อมูล user
    """
    result = _lookup_role(data.email, db)

    if not result:
        raise HTTPException(
            status_code=403,
            detail="ไม่มีสิทธิ์เข้าใช้งานระบบ"
        )

    role, profile_id = result

    is_valid = await verify_otp(
        email=data.email,
        role=role,
        otp=data.otp
    )

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="OTP ไม่ถูกต้องหรือหมดอายุแล้ว"
        )

    # สร้าง JWT token
    access_token = create_access_token(
        profile_id=profile_id,
        email=data.email,
        role=role
    )

    # ✓ OTP ตรวจสอบสำเร็จและสร้าง JWT แล้ว
    return {
        "message": "เข้าสู่ระบบสำเร็จ",
        "success": True,
        "access_token": access_token,
        "token_type": "bearer",
        "role": role,
        "profile_id": profile_id,
        "email": data.email
    }


@router.get("/me")
async def get_current_user_info(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    ดึงข้อมูล current user จาก JWT token
    
    Returns:
        dict: ข้อมูล user พร้อม role และ profile_id
    """
    return {
        "message": "ได้ข้อมูลผู้ใช้แล้ว",
        "success": True,
        "user": {
            "email": current_user.get("email"),
            "role": current_user.get("role"),
            "profile_id": current_user.get("sub"),
            # RBAC: permissions granted to the authenticated role
            "permissions": sorted(
                permissions_for_role(current_user.get("role"))
            ),
        }
    }