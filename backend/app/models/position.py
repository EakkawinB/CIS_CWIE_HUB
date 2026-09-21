from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Numeric,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Position(Base):
    __tablename__ = "positions"

    position_id = Column(
        UUID(as_uuid=True),
        primary_key=True
    )

    company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.company_id"),
        nullable=False,
        index=True
    )

    position_name = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    requirements = Column(
        JSONB,
        nullable=True
    )

    salary = Column(
        Numeric(10, 2),
        nullable=True
    )

    project_topic = Column(
        Text,
        nullable=True
    )

    capacity = Column(
        Integer,
        nullable=True
    )

    start_date = Column(
        Date,
        nullable=True
    )

    end_date = Column(
        Date,
        nullable=True
    )

    status = Column(
        String,
        nullable=False,
        default="open"
    )

    company = relationship(
        "Company",
        back_populates="positions"
    )