from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


InternshipStatus = Literal["placed", "closed"]


class AdvisorAssignmentCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    student_id: int
    advisor_id: UUID


class EligibleStudentResponse(BaseModel):
    student_id: int
    student_code: str | None = None
    student_name: str
    internship_id: UUID
    company_name: str
    position_name: str
    internship_status: InternshipStatus
    start_date: date | None = None
    end_date: date | None = None


class ActiveAdvisorResponse(BaseModel):
    advisor_id: UUID
    advisor_name: str
    department: str | None = None


class AdvisorAssignmentResponse(BaseModel):
    assignment_id: UUID
    student_id: int
    student_code: str | None = None
    student_name: str
    advisor_id: UUID
    advisor_name: str
    company_name: str
    position_name: str
    internship_status: InternshipStatus
    start_date: date | None = None
    end_date: date | None = None
    assigned_at: datetime


class AdvisorStudentResponse(BaseModel):
    student_id: int
    student_code: str | None = None
    student_name: str
    email: str
    company_name: str
    position_name: str
    internship_status: InternshipStatus
    start_date: date | None = None
    end_date: date | None = None


class StudentAdvisorResponse(BaseModel):
    advisor_id: UUID | None = None
    advisor_name: str | None = None
