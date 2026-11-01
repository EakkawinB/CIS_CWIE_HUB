from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.staff import Staff
from app.models.advisor import Advisor
from app.models.mentor import Mentor

from app.schemas.auth import OTPRequest, OTPVerify

from app.services.otp_service import create_otp, verify_otp, EmailDeliveryError
from app.core.security import create_access_token
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def _lookup_role(email: str, db: Session) -> Optional[tuple[str, str]]:
    """
    หา role และ profile_id จาก email
    return (role, profile_id) หรือ None ถ้าไม่เจอ
    """
    student = db.query(Student).filter(
        Student.email == email,
        Student.is_active == True
    ).first()
    if student:
        return "student", str(student.student_id)

    advisor = db.query(Advisor).filter(
        Advisor.email == email,
        Advisor.is_active == True
    ).first()
    if advisor:
        return "advisor", str(advisor.advisor_id)

    mentor = db.query(Mentor).filter(
        Mentor.email == email,
        Mentor.is_active == True
    ).first()
    if mentor:
        return "mentor", str(mentor.mentor_id)

    staff = db.query(Staff).filter(
        Staff.email == email,
        Staff.is_active == True
    ).first()
    if staff:
        return "staff", str(staff.staff_id)

    teacher = db.query(Teacher).filter(
        Teacher.email == email,
        Teacher.is_active == True
    ).first()
    if teacher:
        return "teacher", str(teacher.teacher_id)

    return None


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
        }
    }