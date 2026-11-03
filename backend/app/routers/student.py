from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.student import StudentProfileResponse
from app.core.dependencies import require_role
from app.core.identity import get_student_for_user


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
    student = get_student_for_user(db, current_user)

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลนักศึกษา"
        )

    return student
