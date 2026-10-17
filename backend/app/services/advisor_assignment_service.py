from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.models.advisor import Advisor
from app.models.advisor_assignment import AdvisorStudentAssignment
from app.models.application import StudentApplication
from app.models.internship import Internship
from app.models.position import Position
from app.models.staff import Staff
from app.models.student import Student
from app.models.user import User
from app.schemas.advisor_assignment import (
    ActiveAdvisorResponse,
    AdvisorAssignmentResponse,
    AdvisorStudentResponse,
    EligibleStudentResponse,
    StudentAdvisorResponse,
)


def _full_name(first_name: str, last_name: str) -> str:
    return f"{first_name} {last_name}".strip()


def _get_staff_for_user(db: Session, current_user: dict) -> Staff:
    staff = db.query(Staff).filter(
        Staff.user_id == UUID(current_user["sub"])
    ).first()
    if staff is None:
        raise HTTPException(status_code=404, detail="Staff profile not found")
    return staff


def _get_advisor_for_user(db: Session, current_user: dict) -> Advisor:
    advisor = db.query(Advisor).filter(
        Advisor.user_id == UUID(current_user["sub"])
    ).first()
    if advisor is None:
        raise HTTPException(status_code=404, detail="Advisor profile not found")
    return advisor


def _get_student_for_user(db: Session, current_user: dict) -> Student:
    student = db.query(Student).filter(
        Student.user_id == UUID(current_user["sub"])
    ).first()
    if student is None:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student


def _assignment_query(db: Session):
    return db.query(AdvisorStudentAssignment).options(
        joinedload(AdvisorStudentAssignment.student),
        joinedload(AdvisorStudentAssignment.advisor),
    )


def _internship_query(db: Session):
    return db.query(Internship).options(
        joinedload(Internship.application),
        joinedload(Internship.student),
        joinedload(Internship.position).joinedload(Position.company),
    )


def _to_eligible_student(internship: Internship) -> EligibleStudentResponse:
    return EligibleStudentResponse(
        student_id=internship.student.id,
        student_code=internship.student.student_id,
        student_name=_full_name(
            internship.student.first_name,
            internship.student.last_name,
        ),
        internship_id=internship.internship_id,
        company_name=internship.position.company.company_name,
        position_name=internship.position.position_name,
        internship_status=internship.status,
        start_date=internship.start_date,
        end_date=internship.end_date,
    )


def _to_assignment_response(
    assignment: AdvisorStudentAssignment,
    internship: Internship,
) -> AdvisorAssignmentResponse:
    return AdvisorAssignmentResponse(
        assignment_id=assignment.assignment_id,
        student_id=assignment.student.id,
        student_code=assignment.student.student_id,
        student_name=_full_name(
            assignment.student.first_name,
            assignment.student.last_name,
        ),
        advisor_id=assignment.advisor.advisor_id,
        advisor_name=_full_name(
            assignment.advisor.first_name,
            assignment.advisor.last_name,
        ),
        company_name=internship.position.company.company_name,
        position_name=internship.position.position_name,
        internship_status=internship.status,
        start_date=internship.start_date,
        end_date=internship.end_date,
        assigned_at=assignment.assigned_at,
    )


def list_eligible_students(
    db: Session,
    current_user: dict,
) -> list[EligibleStudentResponse]:
    _get_staff_for_user(db, current_user)
    assigned_student_ids = db.query(AdvisorStudentAssignment.student_id)
    internships = (
        _internship_query(db)
        .join(Internship.application)
        .filter(
            StudentApplication.status == "accepted",
            ~Internship.student_id.in_(assigned_student_ids),
        )
        .order_by(Internship.student_id)
        .all()
    )
    return [_to_eligible_student(item) for item in internships]


def list_active_advisors(
    db: Session,
    current_user: dict,
) -> list[ActiveAdvisorResponse]:
    _get_staff_for_user(db, current_user)
    advisors = (
        db.query(Advisor)
        .join(Advisor.user)
        .filter(User.role == "advisor", User.is_active.is_(True))
        .order_by(Advisor.first_name, Advisor.last_name)
        .all()
    )
    return [
        ActiveAdvisorResponse(
            advisor_id=item.advisor_id,
            advisor_name=_full_name(item.first_name, item.last_name),
            department=item.department,
        )
        for item in advisors
    ]


def list_assignments(
    db: Session,
    current_user: dict,
) -> list[AdvisorAssignmentResponse]:
    _get_staff_for_user(db, current_user)
    rows = (
        db.query(AdvisorStudentAssignment, Internship)
        .join(
            Internship,
            Internship.student_id == AdvisorStudentAssignment.student_id,
        )
        .options(
            joinedload(AdvisorStudentAssignment.student),
            joinedload(AdvisorStudentAssignment.advisor),
            joinedload(Internship.position).joinedload(Position.company),
        )
        .order_by(AdvisorStudentAssignment.assigned_at.desc())
        .all()
    )
    return [
        _to_assignment_response(assignment, internship)
        for assignment, internship in rows
    ]


def _is_student_unique_violation(error: IntegrityError) -> bool:
    original = getattr(error, "orig", None)
    diagnostic = getattr(original, "diag", None)
    return getattr(diagnostic, "constraint_name", None) == (
        "uq_advisor_student_assignments_student_id"
    )


def create_assignment(
    db: Session,
    current_user: dict,
    student_id: int,
    advisor_id: UUID,
) -> AdvisorAssignmentResponse:
    staff = _get_staff_for_user(db, current_user)

    student = db.query(Student).filter(Student.id == student_id).with_for_update().first()
    if student is None:
        db.rollback()
        raise HTTPException(status_code=404, detail="Student not found")

    internship = _internship_query(db).filter(
        Internship.student_id == student_id
    ).first()
    if internship is None:
        db.rollback()
        raise HTTPException(status_code=404, detail="Internship not found")
    if internship.application.status != "accepted":
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student is not eligible for advisor assignment",
        )

    if db.query(AdvisorStudentAssignment).filter(
        AdvisorStudentAssignment.student_id == student_id
    ).first() is not None:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student already has an advisor assignment",
        )

    advisor = (
        db.query(Advisor)
        .join(Advisor.user)
        .filter(Advisor.advisor_id == advisor_id)
        .first()
    )
    if advisor is None:
        db.rollback()
        raise HTTPException(status_code=404, detail="Advisor not found")
    if advisor.user.role != "advisor" or not advisor.user.is_active:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Advisor is not active",
        )

    assignment = AdvisorStudentAssignment(
        student_id=student_id,
        advisor_id=advisor_id,
        assigned_by_staff_id=staff.staff_id,
    )
    db.add(assignment)
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        if _is_student_unique_violation(error):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Student already has an advisor assignment",
            ) from None
        raise HTTPException(
            status_code=500,
            detail="Unable to create advisor assignment",
        ) from None
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to create advisor assignment",
        ) from None

    try:
        db.refresh(assignment)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail=(
                "Advisor assignment was saved, but the response "
                "could not be loaded"
            ),
        ) from None
    assignment.student = student
    assignment.advisor = advisor
    return _to_assignment_response(assignment, internship)


def list_my_advisor_students(
    db: Session,
    current_user: dict,
) -> list[AdvisorStudentResponse]:
    advisor = _get_advisor_for_user(db, current_user)
    rows = (
        db.query(AdvisorStudentAssignment, Internship)
        .join(
            Internship,
            Internship.student_id == AdvisorStudentAssignment.student_id,
        )
        .options(
            joinedload(AdvisorStudentAssignment.student),
            joinedload(Internship.position).joinedload(Position.company),
        )
        .filter(AdvisorStudentAssignment.advisor_id == advisor.advisor_id)
        .all()
    )
    responses = []
    for assignment, internship in rows:
        responses.append(
            AdvisorStudentResponse(
                student_id=assignment.student.id,
                student_code=assignment.student.student_id,
                student_name=_full_name(
                    assignment.student.first_name,
                    assignment.student.last_name,
                ),
                email=assignment.student.email,
                company_name=internship.position.company.company_name,
                position_name=internship.position.position_name,
                internship_status=internship.status,
                start_date=internship.start_date,
                end_date=internship.end_date,
            )
        )
    return responses


def get_my_advisor(
    db: Session,
    current_user: dict,
) -> StudentAdvisorResponse:
    student = _get_student_for_user(db, current_user)
    assignment = _assignment_query(db).filter(
        AdvisorStudentAssignment.student_id == student.id
    ).first()
    if assignment is None:
        return StudentAdvisorResponse()
    return StudentAdvisorResponse(
        advisor_id=assignment.advisor.advisor_id,
        advisor_name=_full_name(
            assignment.advisor.first_name,
            assignment.advisor.last_name,
        ),
    )
