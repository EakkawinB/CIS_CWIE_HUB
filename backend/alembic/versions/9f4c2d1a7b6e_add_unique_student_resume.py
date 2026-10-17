"""add unique student resume constraint

Revision ID: 9f4c2d1a7b6e
Revises: 76c92c776627
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "9f4c2d1a7b6e"
down_revision: Union[str, Sequence[str], None] = "76c92c776627"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "uq_documents_one_resume_per_student",
        "documents",
        ["student_id"],
        unique=True,
        postgresql_where=sa.text("lower(document_type) = 'resume'")
    )


def downgrade() -> None:
    op.drop_index(
        "uq_documents_one_resume_per_student",
        table_name="documents"
    )
