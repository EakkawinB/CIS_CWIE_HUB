from sqlalchemy import (
    Column,
    String
)

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

import uuid

from app.database import Base


class Company(Base):

    __tablename__ = "companies"

    company_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
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