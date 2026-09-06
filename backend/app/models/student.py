from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    func
)

from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Student(Base):

    __tablename__ = "students"

    id = Column(
        Integer,
        primary_key=True
    )

    # เชื่อมกับบัญชีกลาง
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id"),
        unique=True,
        nullable=True   # ชั่วคราวระหว่าง migration
    )

    student_id = Column(
        String,
        unique=True
    )

    # เก็บชั่วคราวจนกว่า Auth ใหม่จะเสร็จ
    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    phone = Column(
        String(30),
        nullable=True
    )

    first_name = Column(
        String(100),
        nullable=False
    )

    last_name = Column(
        String(100),
        nullable=False
    )

    major = Column(String)
    year = Column(Integer)
    gpax = Column(Float)

    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.company_id"),
        nullable=True
    )

    company = relationship(
        "Company",
        back_populates="students"
    )

    documents = relationship(
        "Document",
        back_populates="student"
    )

    # User relationship
    user = relationship(
        "User",
        back_populates="student"
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )