from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.database import get_db
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    MatchingResponse,
)
from app.services.application_service import create_application, get_my_matching


router = APIRouter(tags=["Applications"])


@router.post(
    "/applications",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_application(
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    return create_application(db, current_user, data)


@router.get("/matching/me", response_model=MatchingResponse)
def get_matching_status(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    return get_my_matching(db, current_user)
