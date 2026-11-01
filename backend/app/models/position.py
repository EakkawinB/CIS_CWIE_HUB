import uuid
from sqlalchemy import Column, Date, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Position(Base):
    __tablename__ = "positions"

    position_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.company_id"),
        nullable=True,
    )

    position_name = Column(
        String(100),
        nullable=False
    )

    description = Column(String)

    department = Column(String(100))
    requirements = Column(JSONB)
    salary = Column(Numeric(10, 2))
    project_topic = Column(String)
    capacity = Column(Integer)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String(20), default="open")

    company = relationship("Company", back_populates="positions")
