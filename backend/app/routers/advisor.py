from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.advisor import Advisor
from app.schemas.advisor import AdvisorProfileResponse
from app.core.dependencies import require_role


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
    user_id = UUID(current_user["sub"])

    advisor = db.query(Advisor).filter(
        Advisor.user_id == user_id
    ).first()

    if not advisor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลอาจารย์ที่ปรึกษา"
        )

    return advisor