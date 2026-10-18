"""Add advisor, position, internship, student_application, and advisor_student_assignment tables

Revision ID: 002_add_advisor_position_internship
Revises: 31837ced408a
Create Date: 2026-10-18 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_add_advisor_position_internship'
down_revision: Union[str, Sequence[str], None] = '31837ced408a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create advisors table
    op.create_table(
        'advisors',
        sa.Column('advisor_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(100), nullable=True),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('department', sa.String(100), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('advisor_id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('user_id')
    )

    # Create positions table
    op.create_table(
        'positions',
        sa.Column('position_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('position_name', sa.String(100), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('department', sa.String(100), nullable=True),
        sa.PrimaryKeyConstraint('position_id')
    )

    # Create internships table
    op.create_table(
        'internships',
        sa.Column('internship_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('mentor_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('position', sa.String(100), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('status', sa.String(50), nullable=True, server_default='active'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['student_id'], ['student.student_id'], ),
        sa.ForeignKeyConstraint(['company_id'], ['companies.company_id'], ),
        sa.ForeignKeyConstraint(['mentor_id'], ['mentor.mentor_id'], ),
        sa.PrimaryKeyConstraint('internship_id')
    )

    # Create student_applications table
    op.create_table(
        'student_applications',
        sa.Column('application_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('position_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('status', sa.String(50), nullable=True, server_default='pending'),
        sa.Column('cover_letter', sa.Text(), nullable=True),
        sa.Column('applied_at', sa.DateTime(), nullable=True, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['student_id'], ['student.student_id'], ),
        sa.ForeignKeyConstraint(['position_id'], ['positions.position_id'], ),
        sa.ForeignKeyConstraint(['company_id'], ['companies.company_id'], ),
        sa.PrimaryKeyConstraint('application_id')
    )

    # Create advisor_student_assignments table
    op.create_table(
        'advisor_student_assignments',
        sa.Column('assignment_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('advisor_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('assigned_at', sa.DateTime(), nullable=True, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['advisor_id'], ['advisors.advisor_id'], ),
        sa.ForeignKeyConstraint(['student_id'], ['student.student_id'], ),
        sa.PrimaryKeyConstraint('assignment_id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('advisor_student_assignments')
    op.drop_table('student_applications')
    op.drop_table('internships')
    op.drop_table('positions')
    op.drop_table('advisors')
