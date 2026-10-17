from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.models.application import ACTIVE_APPLICATION_STATUSES, StudentApplication
from app.models.internship import Internship
from app.models.position import Position
from app.models.staff import Staff
from app.models.student import Student
from app.schemas.application import (
    ApplicationCreate,
    InterviewAttendanceRequest,
    InterviewScheduleRequest,
    MatchingResponse,
    RejectionRequest,
    StaffApplicationResponse,
    StaffApplicationListResponse,
)


def _get_student_for_user(db: Session, current_user: dict) -> Student:
    student = db.query(Student).filter(
        Student.user_id == UUID(current_user["sub"])
    ).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student


def _get_staff_for_user(db: Session, current_user: dict) -> Staff:
    staff = db.query(Staff).filter(
        Staff.user_id == UUID(current_user["sub"])
    ).first()
    if staff is None:
        raise HTTPException(status_code=404, detail="Staff profile not found")
    return staff


def _get_locked_application(db: Session, application_id: UUID) -> StudentApplication:
    application_identity = db.query(
        StudentApplication.application_id,
        StudentApplication.student_id,
    ).filter(
        StudentApplication.application_id == application_id
    ).first()
    if application_identity is None:
        raise HTTPException(status_code=404, detail="Application not found")

    db.query(Student).filter(
        Student.id == application_identity.student_id
    ).with_for_update().one()

    return db.query(StudentApplication).filter(
        StudentApplication.application_id == application_id
    ).with_for_update().one()


def _ensure_active(application: StudentApplication) -> None:
    if application.status not in ACTIVE_APPLICATION_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Application is no longer active",
        )


def _commit_application(db: Session, application: StudentApplication) -> None:
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to update application")
    db.refresh(application)


def create_application(
    db: Session,
    current_user: dict,
    data: ApplicationCreate,
) -> StudentApplication:
    student = _get_student_for_user(db, current_user)
    db.query(Student).filter(Student.id == student.id).with_for_update().one()

    position = db.query(Position).filter(
        Position.position_id == data.position_id
    ).first()
    if position is None:
        raise HTTPException(status_code=404, detail="Position not found")
    if position.status != "open":
        raise HTTPException(status_code=409, detail="Position is not open")

    if db.query(Internship).filter(Internship.student_id == student.id).first():
        raise HTTPException(
            status_code=409,
            detail="Student already has an internship",
        )

    active_application = db.query(StudentApplication).filter(
        StudentApplication.student_id == student.id,
        StudentApplication.status.in_(ACTIVE_APPLICATION_STATUSES),
    ).first()
    if active_application:
        raise HTTPException(
            status_code=409,
            detail="Student already has an active application",
        )

    application = StudentApplication(
        student_id=student.id,
        position_id=position.position_id,
        status="applied",
    )
    db.add(application)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Application conflicts with an existing record",
        )
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to create application")
    db.refresh(application)
    return application


def get_my_matching(db: Session, current_user: dict) -> MatchingResponse:
    student = _get_student_for_user(db, current_user)
    history = db.query(StudentApplication).filter(
        StudentApplication.student_id == student.id
    ).order_by(StudentApplication.applied_at.desc()).all()
    active = next(
        (item for item in history if item.status in ACTIVE_APPLICATION_STATUSES),
        None,
    )
    internship = db.query(Internship).filter(
        Internship.student_id == student.id
    ).first()
    return MatchingResponse(
        active_application=active,
        internship=internship,
        application_history=history,
    )


def list_applications(
    db: Session,
    page: int,
    page_size: int,
    application_status: str | None,
    student_id: int | None,
    position_id: UUID | None,
) -> StaffApplicationListResponse:
    query = db.query(StudentApplication).options(
        joinedload(StudentApplication.student),
        joinedload(StudentApplication.position).joinedload(Position.company),
    )
    if application_status is not None:
        query = query.filter(StudentApplication.status == application_status)
    if student_id is not None:
        query = query.filter(StudentApplication.student_id == student_id)
    if position_id is not None:
        query = query.filter(StudentApplication.position_id == position_id)

    total = query.count()
    items = query.order_by(StudentApplication.applied_at.desc()).offset(
        (page - 1) * page_size
    ).limit(page_size).all()
    response_items = [
        _to_staff_application_response(application)
        for application in items
    ]
    return StaffApplicationListResponse(
        items=response_items,
        page=page,
        page_size=page_size,
        total=total,
    )


def _to_staff_application_response(
    application: StudentApplication,
) -> StaffApplicationResponse:
    student = application.student
    position = application.position
    company = position.company if position is not None else None

    student_name = None
    if student is not None:
        student_name = f"{student.first_name} {student.last_name}".strip() or None

    application_data = StaffApplicationResponse.model_validate(
        application
    ).model_dump()
    application_data.update(
        student_name=student_name,
        student_code=student.student_id if student is not None else None,
        company_name=company.company_name if company is not None else None,
        position_name=position.position_name if position is not None else None,
    )
    return StaffApplicationResponse(**application_data)


def schedule_interview(
    db: Session,
    current_user: dict,
    application_id: UUID,
    data: InterviewScheduleRequest,
) -> StudentApplication:
    _get_staff_for_user(db, current_user)
    application = _get_locked_application(db, application_id)
    if application.status != "applied":
        db.rollback()
        raise HTTPException(status_code=409, detail="Interview cannot be scheduled")

    application.interview_at = data.interview_at
    application.interview_channel = data.interview_channel
    application.interview_location = data.interview_location
    application.interview_details = data.interview_details
    application.interview_attended = None
    application.interview_completed_at = None
    application.status = "interview_scheduled"
    _commit_application(db, application)
    return application


def record_attendance(
    db: Session,
    current_user: dict,
    application_id: UUID,
    data: InterviewAttendanceRequest,
) -> StudentApplication:
    _get_staff_for_user(db, current_user)
    application = _get_locked_application(db, application_id)
    if application.status != "interview_scheduled":
        db.rollback()
        raise HTTPException(status_code=409, detail="Attendance cannot be recorded")
    if application.interview_attended is not None:
        db.rollback()
        raise HTTPException(status_code=409, detail="Attendance is already recorded")

    application.interview_attended = data.attended
    application.interview_completed_at = datetime.now(timezone.utc)
    _commit_application(db, application)
    return application


def mark_waiting_result(
    db: Session,
    current_user: dict,
    application_id: UUID,
) -> StudentApplication:
    _get_staff_for_user(db, current_user)
    application = _get_locked_application(db, application_id)
    if application.status not in {"applied", "interview_scheduled"}:
        db.rollback()
        raise HTTPException(status_code=409, detail="Status cannot move to waiting result")

    application.status = "waiting_result"
    _commit_application(db, application)
    return application


def reject_application(
    db: Session,
    current_user: dict,
    application_id: UUID,
    data: RejectionRequest,
) -> StudentApplication:
    staff = _get_staff_for_user(db, current_user)
    application = _get_locked_application(db, application_id)
    _ensure_active(application)

    application.status = "rejected"
    application.rejection_reason = data.rejection_reason
    application.outcome_recorded_by = staff.staff_id
    application.outcome_recorded_at = datetime.now(timezone.utc)
    _commit_application(db, application)
    return application


def accept_application(
    db: Session,
    current_user: dict,
    application_id: UUID,
) -> Internship:
    staff = _get_staff_for_user(db, current_user)
    application = _get_locked_application(db, application_id)
    _ensure_active(application)

    if db.query(Internship).filter(
        Internship.student_id == application.student_id
    ).first():
        db.rollback()
        raise HTTPException(status_code=409, detail="Student already has an internship")

    application.status = "accepted"
    application.outcome_recorded_by = staff.staff_id
    application.outcome_recorded_at = datetime.now(timezone.utc)
    internship = Internship(
        application_id=application.application_id,
        student_id=application.student_id,
        position_id=application.position_id,
        status="placed",
    )
    db.add(internship)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Application acceptance conflicts with an existing record",
        )
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Unable to accept application")
    db.refresh(internship)
    return internship
