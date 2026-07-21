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

from app.database import Base


class Student(Base):

    __tablename__ = "students"

    id = Column(
        Integer,
        primary_key=True
    )

    student_id = Column(
        String,
        unique=True
    )

    # ข้อมูล Login
    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    # ข้อมูลส่วนตัว
    first_name = Column(
        String(100),
        nullable=False
    )

    last_name = Column(
        String(100),
        nullable=False
    )

    major = Column(
        String
    )

    year = Column(
        Integer
    )

    gpax = Column(
        Float
    )

    # ฝึกงาน
    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=True
    )

    company = relationship(
        "Company",
        back_populates="students"
    )

    # เอกสารของนักศึกษา
    documents = relationship(
        "Document",
        back_populates="student"
    )

    # สถานะบัญชี
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