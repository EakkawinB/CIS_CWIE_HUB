"""add advisor student assignments

Revision ID: e2b7c91d4a80
Revises: c1a7e4f92b30
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "e2b7c91d4a80"
down_revision: Union[str, Sequence[str], None] = "c1a7e4f92b30"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "advisor_student_assignments",
        sa.Column(
            "assignment_id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column(
            "advisor_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "assigned_by_staff_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "assigned_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["student_id"],
            ["students.id"],
            name="advisor_student_assignments_student_id_fkey",
        ),
        sa.ForeignKeyConstraint(
            ["advisor_id"],
            ["advisors.advisor_id"],
            name="advisor_student_assignments_advisor_id_fkey",
        ),
        sa.ForeignKeyConstraint(
            ["assigned_by_staff_id"],
            ["staffs.staff_id"],
            name="advisor_student_assignments_assigned_by_staff_id_fkey",
        ),
        sa.PrimaryKeyConstraint(
            "assignment_id",
            name="advisor_student_assignments_pkey",
        ),
        sa.UniqueConstraint(
            "student_id",
            name="uq_advisor_student_assignments_student_id",
        ),
    )
    op.create_index(
        "ix_advisor_student_assignments_advisor_id",
        "advisor_student_assignments",
        ["advisor_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_advisor_student_assignments_advisor_id",
        table_name="advisor_student_assignments",
    )
    op.drop_table("advisor_student_assignments")
