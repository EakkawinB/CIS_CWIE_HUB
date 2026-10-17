from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.database import get_db
from app.schemas.advisor_assignment import (
    ActiveAdvisorResponse,
    AdvisorAssignmentCreate,
    AdvisorAssignmentResponse,
    AdvisorStudentResponse,
    EligibleStudentResponse,
    StudentAdvisorResponse,
)
from app.services import advisor_assignment_service


router = APIRouter(tags=["Advisor Assignments"])


@router.get(
    "/staffs/advisor-assignments/eligible-students",
    response_model=list[EligibleStudentResponse],
)
def get_eligible_students(
    current_user: dict = Depends(require_role("staff")),
    db: Session = Depends(get_db),
):
    return advisor_assignment_service.list_eligible_students(db, current_user)


@router.get(
    "/staffs/advisor-assignments/active-advisors",
    response_model=list[ActiveAdvisorResponse],
)
def get_active_advisors(
    current_user: dict = Depends(require_role("staff")),
    db: Session = Depends(get_db),
):
    return advisor_assignment_service.list_active_advisors(db, current_user)


@router.get(
    "/staffs/advisor-assignments",
    response_model=list[AdvisorAssignmentResponse],
)
def get_assignments(
    current_user: dict = Depends(require_role("staff")),
    db: Session = Depends(get_db),
):
    return advisor_assignment_service.list_assignments(db, current_user)


@router.post(
    "/staffs/advisor-assignments",
    response_model=AdvisorAssignmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def assign_advisor(
    payload: AdvisorAssignmentCreate,
    current_user: dict = Depends(require_role("staff")),
    db: Session = Depends(get_db),
):
    return advisor_assignment_service.create_assignment(
        db,
        current_user,
        payload.student_id,
        payload.advisor_id,
    )


@router.get(
    "/advisors/me/students",
    response_model=list[AdvisorStudentResponse],
)
def get_my_students(
    current_user: dict = Depends(require_role("advisor")),
    db: Session = Depends(get_db),
):
    return advisor_assignment_service.list_my_advisor_students(db, current_user)


@router.get(
    "/students/me/advisor",
    response_model=StudentAdvisorResponse,
)
def get_current_student_advisor(
    current_user: dict = Depends(require_role("student")),
    db: Session = Depends(get_db),
):
    return advisor_assignment_service.get_my_advisor(db, current_user)
