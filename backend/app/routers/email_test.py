from fastapi import APIRouter

from app.services.email_service import send_otp_email


router = APIRouter()


@router.post("/test-email")
def test_email():
    response = send_test_email()

    return {
        "message": "Email sent successfully",
        "response": response,
    }