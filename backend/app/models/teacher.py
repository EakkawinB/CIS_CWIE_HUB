from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    Boolean,
    func
)

from app.database import Base


class Teacher(Base):

    __tablename__ = "teachers"

    id = Column(
        Integer,
        primary_key=True
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

    teacher_code = Column(
        String
    )

    department = Column(
        String,
        default="Computer and Information Science"
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