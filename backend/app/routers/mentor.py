from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.mentor import MentorProfileResponse
from app.core.dependencies import require_role
from app.core.identity import get_mentor_for_user


router = APIRouter(
    prefix="/mentors",
    tags=["Mentors"]
)


@router.get(
    "/me",
    response_model=MentorProfileResponse
)
def get_my_profile(
    current_user=Depends(require_role("mentor")),
    db: Session = Depends(get_db)
):
    mentor = get_mentor_for_user(db, current_user)

    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลพี่เลี้ยง"
        )

    return mentor