from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mentor import Mentor
from app.schemas.mentor import MentorProfileResponse
from app.core.dependencies import require_role


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
    user_id = UUID(current_user["sub"])

    mentor = db.query(Mentor).filter(
        Mentor.user_id == user_id
    ).first()

    if not mentor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลพี่เลี้ยง"
        )

    return mentor