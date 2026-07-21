from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database import Base


class Document(Base):

    __tablename__ = "documents"

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