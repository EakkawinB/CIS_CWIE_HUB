"""align server defaults with current models

Revision ID: 4d2f8a6c1b90
Revises: e2b7c91d4a80
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "4d2f8a6c1b90"
down_revision: Union[str, Sequence[str], None] = "e2b7c91d4a80"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "companies",
        "is_active",
        existing_type=sa.Boolean(),
        existing_nullable=False,
        server_default=None,
    )
    op.alter_column(
        "users",
        "status",
        existing_type=sa.String(length=20),
        existing_nullable=False,
        server_default=None,
    )
    op.alter_column(
        "users",
        "created_at",
        existing_type=sa.DateTime(timezone=True),
        existing_nullable=True,
        server_default=sa.func.now(),
    )


def downgrade() -> None:
    op.alter_column(
        "users",
        "created_at",
        existing_type=sa.DateTime(timezone=True),
        existing_nullable=True,
        server_default=None,
    )
    op.alter_column(
        "users",
        "status",
        existing_type=sa.String(length=20),
        existing_nullable=False,
        server_default="pending",
    )
    op.alter_column(
        "companies",
        "is_active",
        existing_type=sa.Boolean(),
        existing_nullable=False,
        server_default=sa.true(),
    )
