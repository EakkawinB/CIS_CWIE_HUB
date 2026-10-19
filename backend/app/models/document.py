from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Index,
    text
)

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
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    # เจ้าของเอกสาร
    student = relationship(
        "Student",
        back_populates="documents"
    )

    document_type = Column(
        String
    )

    file_url = Column(
        String
    )

    status = Column(
        String,
        default="pending"
    )

    comments = Column(
        Text,
        nullable=True
    )

    uploaded_at = Column(
        DateTime,
        nullable=True
    )

    updated_at = Column(
        DateTime,
        nullable=True
    )
