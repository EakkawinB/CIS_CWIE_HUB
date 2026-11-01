from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.schemas.student import StudentProfileResponse
from app.core.dependencies import require_role


router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.get(
    "/me",
    response_model=StudentProfileResponse
)
def get_my_profile(
    current_user=Depends(require_role("student")),
    db: Session = Depends(get_db)
):
    user_id = UUID(current_user["sub"])

    student = db.query(Student).filter(
        Student.user_id == user_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลนักศึกษา"
        )

    return student
