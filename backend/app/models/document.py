from sqlalchemy import (
    Column,
    Integer,
    String,
<<<<<<< HEAD
    Text,
    DateTime,
    ForeignKey,
    Index,
    text
=======
    ForeignKey,
    UUID as SQLAlchemy_UUID,
    DateTime,
    Text
>>>>>>> origin/su
)
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Document(Base):

    __tablename__ = "documents"
    __table_args__ = (
        Index(
            "uq_documents_one_resume_per_student",
            "student_id",
            unique=True,
            postgresql_where=text("lower(document_type) = 'resume'")
        ),
    )

    id = Column(
        Integer,
        primary_key=True
    )

    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student.student_id"),
        nullable=False
    )

    # เจ้าของเอกสาร
    student = relationship(
        "Student",
        backref="documents"
    )

    document_type = Column(
        String(100),
        nullable=False
    )

    file_url = Column(String)

    status = Column(
        String(50),
        default="pending"
    )

<<<<<<< HEAD
    comments = Column(
        Text,
        nullable=True
    )

    uploaded_at = Column(
        DateTime,
        nullable=True
=======
    comments = Column(Text)

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
>>>>>>> origin/su
    )

    updated_at = Column(
        DateTime,
<<<<<<< HEAD
        nullable=True
    )
=======
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
>>>>>>> origin/su
