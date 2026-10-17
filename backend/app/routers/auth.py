from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.staff import Staff

from app.schemas.auth import OTPRequest, OTPVerify

from app.services.otp_service import create_otp, verify_otp


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


def _lookup_role(email: str, db: Session) -> tuple[str, int] | None:
    """
    หา role และ profile_id จาก email
    return (role, profile_id) หรือ None ถ้าไม่เจอ
    """
    student = db.query(Student).filter(
        Student.email == email,
        Student.is_active == True
    ).first()
    if student:
        return "student", student.id

    teacher = db.query(Teacher).filter(
        Teacher.email == email,
        Teacher.is_active == True
    ).first()
    if teacher:
        return "teacher", teacher.id

    staff = db.query(Staff).filter(
        Staff.email == email,
        Staff.is_active == True
    ).first()
    if staff:
        return "staff", staff.staff_id

    return None


@router.post("/request-otp")
async def request_otp(
    data: OTPRequest,
    db: Session = Depends(get_db)
):
    result = _lookup_role(data.email, db)

    if not result:
        raise HTTPException(
            status_code=403,
            detail="ไม่มีสิทธิ์เข้าใช้งานระบบ"
        )

    role, _ = result

    otp = await create_otp(
        email=data.email,
        role=role,
        db=db
    )

    # ✓ OTP ถูกส่งไปยัง email ผ่าน Mailpit แล้ว
    # (ส่งโดยอัตโนมัติใน create_otp function)

    return {
        "message": "ส่ง OTP แล้ว กรุณาตรวจสอบอีเมลของคุณ",
        "role": role,
        "email": data.email
    }


@router.post("/verify-otp")
async def verify_otp_route(
    data: OTPVerify,
    db: Session = Depends(get_db)
):
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

    # ✓ OTP ตรวจสอบสำเร็จ
    # TODO: สร้าง JWT แล้ว return
    return {
        "message": "เข้าสู่ระบบสำเร็จ",
        "role": role,
        "profile_id": profile_id
    }