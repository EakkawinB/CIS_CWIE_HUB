from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

from app.schemas.auth import OTPRequest, OTPVerify

from app.services.email_service import send_otp_email
from app.services.otp_service import create_otp, verify_otp

from app.core.security import create_access_token
from app.core.dependencies import get_current_user, require_role

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/request-otp")
async def request_otp(
    data: OTPRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == data.email,
        User.is_active == True
    ).first()

    if not user:
        raise HTTPException(
            status_code=403,
            detail="ไม่มีสิทธิ์เข้าใช้งานระบบ"
        )

    role = user.role

    otp = await create_otp(
        email=data.email,
        role=role,
        db=db
    )

    # TODO: ส่ง OTP ผ่าน Gmail SMTP
    send_otp_email(
        email=data.email,
        otp=otp
    )

    return {
        "message": "ส่ง OTP แล้ว",
        "role": role
    }


@router.post("/verify-otp")
async def verify_otp_route(
    data: OTPVerify,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == data.email,
        User.is_active == True
    ).first()

    if not user:
        raise HTTPException(
            status_code=403,
            detail="ไม่มีสิทธิ์เข้าใช้งานระบบ"
        )

    role = user.role
    user_id = user.user_id

    otp_result = await verify_otp(
        email=data.email,
        role=role,
        otp=data.otp,
        db=db
    )

    if otp_result == "expired":
        raise HTTPException(
            status_code=400,
            detail="OTP หมดอายุแล้ว กรุณาขอ OTP ใหม่"
        )

    if otp_result == "invalid":
        raise HTTPException(
            status_code=400,
            detail="OTP ไม่ถูกต้อง"
        )

    # TODO: สร้าง JWT แล้ว return
    access_token = create_access_token(
        user_id=user_id,
        email=data.email,
        role=role
    )

    return {
        "message": "เข้าสู่ระบบสำเร็จ",
        "access_token": access_token,
        "token_type": "bearer",
        "role": role,
        "user_id": str(user_id)
    }

@router.get("/me")
async def get_current_user_route(
    current_user: dict = Depends(get_current_user)
):
    return current_user

@router.get("/student-test")
def student_test(
    current_user = Depends(require_role("student"))
):
    return {
        "message": "Student access granted",
        "user": current_user
    }

@router.get("/staff-test")
def staff_test(
    current_user = Depends(require_role("staff"))
):
    return {
        "message": "Staff access granted",
        "user": current_user
    }

@router.get("/advisor-test")
def advisor_test(
    current_user=Depends(require_role("advisor"))
):
    return {
        "message": "Advisor access granted",
        "user": current_user
    }


@router.get("/mentor-test")
def mentor_test(
    current_user=Depends(require_role("mentor"))
):
    return {
        "message": "Mentor access granted",
        "user": current_user
    }