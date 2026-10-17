"""add application and internship foundation

Revision ID: c1a7e4f92b30
Revises: 9f4c2d1a7b6e
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "c1a7e4f92b30"
down_revision: Union[str, Sequence[str], None] = "9f4c2d1a7b6e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "student_applications",
        sa.Column(
            "application_id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column(
            "position_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.String(length=30),
            server_default="applied",
            nullable=False,
        ),
        sa.Column("interview_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("interview_channel", sa.String(length=20), nullable=True),
        sa.Column("interview_location", sa.String(), nullable=True),
        sa.Column("interview_details", sa.Text(), nullable=True),
        sa.Column("interview_attended", sa.Boolean(), nullable=True),
        sa.Column(
            "interview_completed_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column("rejection_reason", sa.Text(), nullable=True),
        sa.Column(
            "outcome_recorded_by",
            postgresql.UUID(as_uuid=True),
            nullable=True,
        ),
        sa.Column(
            "outcome_recorded_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "applied_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.CheckConstraint(
            "status IN ('applied', 'interview_scheduled', "
            "'waiting_result', 'accepted', 'rejected')",
            name="ck_student_applications_status",
        ),
        sa.ForeignKeyConstraint(
            ["outcome_recorded_by"],
            ["staffs.staff_id"],
            name="student_applications_outcome_recorded_by_fkey",
        ),
        sa.ForeignKeyConstraint(
            ["position_id"],
            ["positions.position_id"],
            name="student_applications_position_id_fkey",
        ),
        sa.ForeignKeyConstraint(
            ["student_id"],
            ["students.id"],
            name="student_applications_student_id_fkey",
        ),
        sa.PrimaryKeyConstraint(
            "application_id",
            name="student_applications_pkey",
        ),
        sa.UniqueConstraint(
            "application_id",
            "student_id",
            "position_id",
            name="uq_student_applications_identity",
        ),
    )
    op.create_index(
        "ix_student_applications_position_id",
        "student_applications",
        ["position_id"],
    )
    op.create_index(
        "ix_student_applications_status",
        "student_applications",
        ["status"],
    )
    op.create_index(
        "ix_student_applications_student_id",
        "student_applications",
        ["student_id"],
    )
    op.create_index(
        "uq_student_applications_one_active_per_student",
        "student_applications",
        ["student_id"],
        unique=True,
        postgresql_where=sa.text(
            "status IN ('applied', 'interview_scheduled', 'waiting_result')"
        ),
    )

    op.create_table(
        "internships",
        sa.Column(
            "internship_id",
            postgresql.UUID(as_uuid=True),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column(
            "application_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column("student_id", sa.Integer(), nullable=False),
        sa.Column(
            "position_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.String(length=20),
            server_default="placed",
            nullable=False,
        ),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column(
            "placed_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("closed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "closed_by_staff_id",
            postgresql.UUID(as_uuid=True),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.CheckConstraint(
            "status IN ('placed', 'closed')",
            name="ck_internships_status",
        ),
        sa.CheckConstraint(
            "start_date IS NULL OR end_date IS NULL OR end_date >= start_date",
            name="ck_internships_date_range",
        ),
        sa.CheckConstraint(
            "(status = 'placed' AND closed_at IS NULL "
            "AND closed_by_staff_id IS NULL) OR "
            "(status = 'closed' AND closed_at IS NOT NULL "
            "AND closed_by_staff_id IS NOT NULL)",
            name="ck_internships_closure_metadata",
        ),
        sa.ForeignKeyConstraint(
            ["closed_by_staff_id"],
            ["staffs.staff_id"],
            name="internships_closed_by_staff_id_fkey",
        ),
        sa.ForeignKeyConstraint(
            ["student_id"],
            ["students.id"],
            name="internships_student_id_fkey",
        ),
        sa.ForeignKeyConstraint(
            ["position_id"],
            ["positions.position_id"],
            name="internships_position_id_fkey",
        ),
        sa.ForeignKeyConstraint(
            ["application_id", "student_id", "position_id"],
            [
                "student_applications.application_id",
                "student_applications.student_id",
                "student_applications.position_id",
            ],
            name="fk_internships_matching_application",
        ),
        sa.PrimaryKeyConstraint("internship_id", name="internships_pkey"),
        sa.UniqueConstraint(
            "application_id",
            name="uq_internships_application_id",
        ),
        sa.UniqueConstraint(
            "student_id",
            name="uq_internships_student_id",
        ),
    )


def downgrade() -> None:
    # This removes all Application/Internship data. Review and back up real
    # data before using this downgrade outside a disposable environment.
    op.drop_table("internships")
    op.drop_index(
        "uq_student_applications_one_active_per_student",
        table_name="student_applications",
    )
    op.drop_index(
        "ix_student_applications_student_id",
        table_name="student_applications",
    )
    op.drop_index(
        "ix_student_applications_status",
        table_name="student_applications",
    )
    op.drop_index(
        "ix_student_applications_position_id",
        table_name="student_applications",
    )
    op.drop_table("student_applications")
