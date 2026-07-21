from sqlalchemy import (
    Column,
    Integer,
    String
)

from sqlalchemy.orm import relationship

from app.database import Base


class Company(Base):

    __tablename__ = "companies"

    id = Column(
        Integer,
        primary_key=True
    )

    company_name = Column(
        String,
        nullable=False
    )

    email = Column(
        String
    )

    phone = Column(
        String
    )

    address = Column(
        String
    )

    # นักศึกษาที่ฝึกงานที่บริษัทนี้
    students = relationship(
        "Student",
        back_populates="company"
    )