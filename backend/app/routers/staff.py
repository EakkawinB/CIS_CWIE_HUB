from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.staff import Staff
from app.schemas.staff import StaffProfileResponse
from app.core.dependencies import require_role


router = APIRouter(
    prefix="/staffs",
    tags=["Staffs"]
)


@router.get(
    "/me",
    response_model=StaffProfileResponse
)
def get_my_profile(
    current_user=Depends(require_role("staff")),
    db: Session = Depends(get_db)
):
    user_id = UUID(current_user["sub"])

    staff = db.query(Staff).filter(
        Staff.user_id == user_id
    ).first()

    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลเจ้าหน้าที่"
        )

    return staff