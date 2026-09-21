from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.dependencies import require_role
from app.models.company import Company
from app.models.position import Position
from app.schemas.position import (
    PositionCreate,
    PositionUpdate,
    PositionResponse,
)


router = APIRouter(
    prefix="/positions",
    tags=["Positions"],
)


# =========================================================
# GET ALL POSITIONS
# ทุก role ที่ login สามารถดูได้
# =========================================================
@router.get(
    "",
    response_model=list[PositionResponse],
)
def get_positions(
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("student", "advisor", "mentor", "staff")
    ),
):
    return db.query(Position).all()


@router.get(
    "/{position_id}",
    response_model=PositionResponse,
)
def get_position(
    position_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(
        require_role("student", "advisor", "mentor", "staff")
    ),
):
    position = (
        db.query(Position)
        .filter(Position.position_id == position_id)
        .first()
    )

    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found",
        )

    return position


@router.post(
    "",
    response_model=PositionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_position(
    data: PositionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    # ตรวจว่าบริษัทมีอยู่จริง
    company = (
        db.query(Company)
        .filter(Company.company_id == data.company_id)
        .first()
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    position = Position(
        position_id=uuid4(),
        **data.model_dump(),
    )

    db.add(position)
    db.commit()
    db.refresh(position)

    return position


@router.patch(
    "/{position_id}",
    response_model=PositionResponse,
)
def update_position(
    position_id: UUID,
    data: PositionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    position = (
        db.query(Position)
        .filter(Position.position_id == position_id)
        .first()
    )

    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found",
        )

    update_data = data.model_dump(exclude_unset=True)

    # ถ้ามีการเปลี่ยน company_id
    # ต้องตรวจว่าบริษัทปลายทางมีจริง
    if "company_id" in update_data:
        company = (
            db.query(Company)
            .filter(Company.company_id == update_data["company_id"])
            .first()
        )

        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found",
            )

    for field, value in update_data.items():
        setattr(position, field, value)

    db.commit()
    db.refresh(position)

    return position


@router.delete(
    "/{position_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_position(
    position_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    position = (
        db.query(Position)
        .filter(Position.position_id == position_id)
        .first()
    )

    if not position:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Position not found",
        )

    db.delete(position)
    db.commit()

    return None

    \ No newline at end of file