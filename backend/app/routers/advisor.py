from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.advisor import AdvisorProfileResponse
from app.core.dependencies import require_role
from app.core.identity import get_advisor_for_user


router = APIRouter(
    prefix="/advisors",
    tags=["Advisors"]
)


@router.get(
    "/me",
    response_model=AdvisorProfileResponse
)
def get_my_profile(
    current_user=Depends(require_role("advisor")),
    db: Session = Depends(get_db)
):
    advisor = get_advisor_for_user(db, current_user)

    if not advisor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลอาจารย์ที่ปรึกษา"
        )

    return advisor