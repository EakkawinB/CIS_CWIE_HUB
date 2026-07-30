from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    UUID as SQLAlchemy_UUID,
    DateTime,
    Text
)
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Document(Base):

    __tablename__ = "documents"

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

    comments = Column(Text)

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )