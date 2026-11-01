from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    status,
)
from datetime import datetime, timezone
from pathlib import Path
from uuid import UUID, uuid4

from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.document import Document
from app.models.student import Student
from app.schemas.document import (
    DocumentListResponse,
    ResumeDownloadResponse,
    ResumeResponse,
)
from app.core.dependencies import require_role
from app.services.storage_service import (
    create_signed_download_url,
    delete_file,
    upload_file,
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

RESUME_TYPE = "resume"
MAX_RESUME_SIZE = 5 * 1024 * 1024
SIGNED_URL_EXPIRES_IN_SECONDS = 60


def _find_resume(db: Session, student_id: int) -> Document | None:
    return db.query(Document).filter(
        Document.student_id == student_id,
        func.lower(Document.document_type) == RESUME_TYPE
    ).first()


def _create_resume_download_response(
    resume: Document
) -> ResumeDownloadResponse:
    try:
        download_url = create_signed_download_url(
            resume.file_url,
            SIGNED_URL_EXPIRES_IN_SECONDS
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ไม่สามารถเปิดไฟล์ Resume ได้"
        )

    return ResumeDownloadResponse(
        download_url=download_url,
        expires_in_seconds=SIGNED_URL_EXPIRES_IN_SECONDS
    )


@router.get(
    "/me",
    response_model=list[DocumentListResponse]
)
def get_my_documents(
    current_user=Depends(require_role("student")),
    db: Session = Depends(get_db)
):
    user_id = UUID(current_user["sub"])

    student = db.query(Student).filter(
        Student.user_id == user_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ไม่พบข้อมูลนักศึกษา"
        )

    documents = db.query(Document).filter(
        Document.student_id == student.id
    ).all()

    return documents


@router.get(
    "/resume/me",
    response_model=ResumeResponse
)
def get_my_resume(
    current_user=Depends(require_role("student")),
    db: Session = Depends(get_db)
):
    user_id = UUID(current_user["sub"])
    student = db.query(Student).filter(Student.user_id == user_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลนักศึกษา")

    resume = _find_resume(db, student.id)
    if not resume:
        raise HTTPException(status_code=404, detail="ยังไม่มี Resume")

    return resume


@router.post(
    "/resume/upload",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED
)
def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(require_role("student")),
    db: Session = Depends(get_db)
):
    user_id = UUID(current_user["sub"])
    student = db.query(Student).filter(Student.user_id == user_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลนักศึกษา")

    if _find_resume(db, student.id):
        raise HTTPException(status_code=409, detail="มี Resume อยู่แล้ว")

    extension = Path(file.filename or "").suffix.lower()
    if file.content_type != "application/pdf" or extension != ".pdf":
        raise HTTPException(status_code=400, detail="รองรับเฉพาะไฟล์ PDF")

    content = bytearray()
    while True:
        chunk = file.file.read(1024 * 1024)
        if not chunk:
            break
        content.extend(chunk)
        if len(content) > MAX_RESUME_SIZE:
            raise HTTPException(
                status_code=400,
                detail="ไฟล์ Resume ต้องมีขนาดไม่เกิน 5 MiB"
            )

    file_content = bytes(content)
    if (
        not file_content.startswith(b"%PDF-")
        or b"%%EOF" not in file_content[-1024:]
    ):
        raise HTTPException(status_code=400, detail="ไฟล์ PDF ไม่ถูกต้อง")

    storage_path = f"students/{student.id}/resumes/{uuid4()}.pdf"
    try:
        upload_file(
            file_path=storage_path,
            file_content=file_content,
            content_type="application/pdf",
            upsert=False
        )
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="ไม่สามารถอัปโหลด Resume ได้"
        )

    now = datetime.now(timezone.utc)
    resume = Document(
        student_id=student.id,
        document_type=RESUME_TYPE,
        file_url=storage_path,
        status="submitted",
        uploaded_at=now,
        updated_at=now
    )
    db.add(resume)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        try:
            delete_file(storage_path)
        except Exception:
            pass
        raise HTTPException(status_code=409, detail="มี Resume อยู่แล้ว")
    except Exception:
        db.rollback()
        try:
            delete_file(storage_path)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail="ไม่สามารถบันทึก Resume ได้")

    db.refresh(resume)
    return resume


@router.get(
    "/resume/me/download",
    response_model=ResumeDownloadResponse
)
def download_my_resume(
    current_user=Depends(require_role("student")),
    db: Session = Depends(get_db)
):
    user_id = UUID(current_user["sub"])
    student = db.query(Student).filter(Student.user_id == user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลนักศึกษา")

    resume = _find_resume(db, student.id)
    if not resume or not resume.file_url:
        raise HTTPException(status_code=404, detail="ยังไม่มี Resume")

    return _create_resume_download_response(resume)


@router.get(
    "/resume/students/{student_code}",
    response_model=ResumeResponse
)
def get_student_resume_for_staff(
    student_code: str,
    current_user=Depends(require_role("staff")),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.student_id == student_code).first()
    if not student:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลนักศึกษา")

    resume = _find_resume(db, student.id)
    if not resume:
        raise HTTPException(status_code=404, detail="ยังไม่มี Resume")

    return resume


@router.get(
    "/resume/students/{student_code}/download",
    response_model=ResumeDownloadResponse
)
def download_student_resume_for_staff(
    student_code: str,
    current_user=Depends(require_role("staff")),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.student_id == student_code).first()
    if not student:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลนักศึกษา")

    resume = _find_resume(db, student.id)
    if not resume or not resume.file_url:
        raise HTTPException(status_code=404, detail="ยังไม่มี Resume")

    return _create_resume_download_response(resume)

