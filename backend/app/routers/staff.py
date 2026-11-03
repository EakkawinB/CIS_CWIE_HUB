from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.staff import StaffProfileResponse
from app.core.dependencies import require_role
from app.core.identity import get_staff_for_user


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
    staff = get_staff_for_user(db, current_user)

    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลเจ้าหน้าที่"
        )

    return staff