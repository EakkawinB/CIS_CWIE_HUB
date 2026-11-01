from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.advisor import Advisor
from app.models.mentor import Mentor
from app.models.staff import Staff
from app.models.student import Student
from app.models.teacher import Teacher


def parse_subject(current_user: dict) -> UUID:
    try:
        return UUID(str(current_user["sub"]))
    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
        )


def _by_subject(query, primary_attr, user_id_attr, subject: UUID):
    record = query.filter(primary_attr == subject).first()
    if record is None:
        record = query.filter(user_id_attr == subject).first()
    return record


def get_student_for_user(db: Session, current_user: dict) -> Student:
    subject = parse_subject(current_user)
    student = _by_subject(
        db.query(Student),
        Student.student_id,
        Student.user_id,
        subject,
    )
    if student is None:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return student


def get_staff_for_user(db: Session, current_user: dict) -> Staff:
    subject = parse_subject(current_user)
    staff = _by_subject(
        db.query(Staff),
        Staff.staff_id,
        Staff.user_id,
        subject,
    )
    if staff is None:
        raise HTTPException(status_code=404, detail="Staff profile not found")
    return staff


def get_advisor_for_user(db: Session, current_user: dict) -> Advisor:
    subject = parse_subject(current_user)
    advisor = _by_subject(
        db.query(Advisor),
        Advisor.advisor_id,
        Advisor.user_id,
        subject,
    )
    if advisor is None:
        raise HTTPException(status_code=404, detail="Advisor profile not found")
    return advisor


def get_mentor_for_user(db: Session, current_user: dict) -> Mentor:
    subject = parse_subject(current_user)
    mentor = _by_subject(
        db.query(Mentor),
        Mentor.mentor_id,
        Mentor.user_id,
        subject,
    )
    if mentor is None:
        raise HTTPException(status_code=404, detail="Mentor profile not found")
    return mentor


def get_teacher_for_user(db: Session, current_user: dict) -> Teacher:
    subject = parse_subject(current_user)
    teacher = _by_subject(
        db.query(Teacher),
        Teacher.teacher_id,
        Teacher.user_id,
        subject,
    )
    if teacher is None:
        raise HTTPException(status_code=404, detail="Teacher profile not found")
    return teacher


def person_display_name(record) -> str:
    first_name = getattr(record, "first_name", None)
    last_name = getattr(record, "last_name", None)
    if first_name or last_name:
        return f"{first_name or ''} {last_name or ''}".strip()
    return (getattr(record, "name", None) or "").strip()


def split_display_name(record) -> tuple[str, str]:
    first_name = getattr(record, "first_name", None)
    last_name = getattr(record, "last_name", None)
    if first_name or last_name:
        return first_name or "", last_name or ""
    name = (getattr(record, "name", None) or "").strip()
    if not name:
        return "", ""
    parts = name.split(None, 1)
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], parts[1]


def student_primary_key(student):
    if getattr(student, "id", None) is not None and getattr(
        student, "student_code", None
    ) is None:
        return student.id
    return student.student_id


def student_code_value(student) -> str | None:
    code = getattr(student, "student_code", None)
    if code:
        return str(code)
    student_id = getattr(student, "student_id", None)
    if isinstance(student_id, str):
        return student_id
    return None
