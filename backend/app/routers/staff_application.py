from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.database import get_db
from app.schemas.application import (
    ApplicationResponse,
    InterviewAttendanceRequest,
    InterviewScheduleRequest,
    InternshipResponse,
    RejectionRequest,
    StaffApplicationListResponse,
)
from app.services.application_service import (
    accept_application,
    list_applications,
    mark_waiting_result,
    record_attendance,
    reject_application,
    schedule_interview,
)


router = APIRouter(prefix="/staffs", tags=["Staff Applications"])


@router.get("/applications", response_model=StaffApplicationListResponse)
def get_applications(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    application_status: Literal[
        "applied",
        "interview_scheduled",
        "waiting_result",
        "accepted",
        "rejected",
    ] | None = Query(default=None, alias="status"),
    student_id: int | None = Query(default=None),
    position_id: UUID | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    return list_applications(
        db,
        page,
        page_size,
        application_status,
        student_id,
        position_id,
    )


@router.patch(
    "/applications/{application_id}/interview",
    response_model=ApplicationResponse,
)
def set_interview(
    application_id: UUID,
    data: InterviewScheduleRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    return schedule_interview(db, current_user, application_id, data)


@router.patch(
    "/applications/{application_id}/attendance",
    response_model=ApplicationResponse,
)
def set_attendance(
    application_id: UUID,
    data: InterviewAttendanceRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    return record_attendance(db, current_user, application_id, data)


@router.patch(
    "/applications/{application_id}/waiting-result",
    response_model=ApplicationResponse,
)
def set_waiting_result(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    return mark_waiting_result(db, current_user, application_id)


@router.patch(
    "/applications/{application_id}/reject",
    response_model=ApplicationResponse,
)
def set_rejected(
    application_id: UUID,
    data: RejectionRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    return reject_application(db, current_user, application_id, data)


@router.post(
    "/applications/{application_id}/accept",
    response_model=InternshipResponse,
)
def set_accepted(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("staff")),
):
    return accept_application(db, current_user, application_id)
