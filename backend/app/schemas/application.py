from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


ApplicationStatus = Literal[
    "applied",
    "interview_scheduled",
    "waiting_result",
    "accepted",
    "rejected",
]
InterviewChannel = Literal["online", "onsite", "phone"]
InternshipStatus = Literal["placed", "closed"]


class ApplicationCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    position_id: UUID


class InterviewScheduleRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    interview_at: datetime
    interview_channel: InterviewChannel
    interview_location: str | None = None
    interview_details: str | None = None

    @field_validator("interview_at")
    @classmethod
    def require_timezone(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("interview_at must include a timezone")
        return value

    @field_validator("interview_location", "interview_details")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None

    @model_validator(mode="after")
    def validate_location(self):
        if self.interview_channel in {"online", "onsite"}:
            if self.interview_location is None:
                raise ValueError(
                    "interview_location is required for online or onsite interviews"
                )
        return self


class InterviewAttendanceRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    attended: bool


class RejectionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    rejection_reason: str | None = None

    @field_validator("rejection_reason")
    @classmethod
    def normalize_reason(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    application_id: UUID
    student_id: int
    position_id: UUID
    status: ApplicationStatus
    interview_at: datetime | None = None
    interview_channel: InterviewChannel | None = None
    interview_location: str | None = None
    interview_details: str | None = None
    interview_attended: bool | None = None
    interview_completed_at: datetime | None = None
    rejection_reason: str | None = None
    outcome_recorded_by: UUID | None = None
    outcome_recorded_at: datetime | None = None
    applied_at: datetime
    created_at: datetime
    updated_at: datetime


class StaffApplicationResponse(ApplicationResponse):
    student_name: str | None = None
    student_code: str | None = None
    company_name: str | None = None
    position_name: str | None = None


class InternshipResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    internship_id: UUID
    application_id: UUID
    student_id: int
    position_id: UUID
    status: InternshipStatus
    start_date: date | None = None
    end_date: date | None = None
    placed_at: datetime
    closed_at: datetime | None = None
    closed_by_staff_id: UUID | None = None
    created_at: datetime
    updated_at: datetime


class MatchingResponse(BaseModel):
    active_application: ApplicationResponse | None = None
    internship: InternshipResponse | None = None
    application_history: list[ApplicationResponse] = Field(default_factory=list)


class StaffApplicationListResponse(BaseModel):
    items: list[StaffApplicationResponse]
    page: int
    page_size: int
    total: int
