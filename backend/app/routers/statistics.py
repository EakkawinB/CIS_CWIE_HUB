"""
Statistics router - provides public endpoints for landing page statistics
Public endpoints (no authentication required)
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.student import Student
from app.models.advisor import Advisor
from app.models.company import Company
from app.models.document import Document
from app.models.user import User

router = APIRouter(
    prefix="/statistics",
    tags=["Statistics"]
)


class StatisticsResponse:
    """Response model for statistics endpoint"""
    def __init__(self, total_students: int, total_advisors: int, total_companies: int, completion_rate: float):
        self.total_students = total_students
        self.total_advisors = total_advisors
        self.total_companies = total_companies
        self.completion_rate = completion_rate


@router.get(
    "/overview",
    response_model=dict
)
def get_statistics_overview(
    db: Session = Depends(get_db)
):
    """
    Get landing page statistics - Public endpoint (no auth required)
    Returns:
    - total_students: Count of active students
    - total_advisors: Count of active advisors
    - total_companies: Count of active companies
    - completion_rate: Percentage of students with submitted documents
    """
    
    # Get total active students
    total_students = db.query(func.count(Student.student_id)).filter(
        Student.is_active == True
    ).scalar() or 0
    
    # Get total active advisors
    # NOTE: public.advisors has no is_active column; the account state
    # lives on public.users.is_active.
    total_advisors = db.query(func.count(Advisor.advisor_id)).join(
        User, Advisor.user_id == User.user_id
    ).filter(
        User.is_active == True
    ).scalar() or 0
    
    # Get total active companies
    total_companies = db.query(func.count(Company.company_id)).filter(
        Company.is_active == True
    ).scalar() or 0
    
    # Calculate completion rate: students with documents / total students
    students_with_documents = db.query(func.count(func.distinct(Document.student_id))).scalar() or 0
    
    completion_rate = 0
    if total_students > 0:
        completion_rate = min(100, int((students_with_documents / total_students) * 100))
    
    return {
        "total_students": total_students,
        "total_advisors": total_advisors,
        "total_companies": total_companies,
        "completion_rate": completion_rate
    }
