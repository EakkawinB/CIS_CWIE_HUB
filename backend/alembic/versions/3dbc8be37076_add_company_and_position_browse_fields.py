"""add company and position browse fields

Revision ID: 3dbc8be37076
Revises: 62cb37fec27b
Create Date: 2026-09-22 01:52:41.739506

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3dbc8be37076'
down_revision: Union[str, Sequence[str], None] = '62cb37fec27b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        'companies',
        sa.Column('industry', sa.String(), nullable=True)
    )
    op.add_column(
        'companies',
        sa.Column('description', sa.Text(), nullable=True)
    )
    op.add_column(
        'companies',
        sa.Column('logo_url', sa.String(), nullable=True)
    )

    op.add_column(
        'positions',
        sa.Column(
            'requirements',
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True
        )
    )
    op.add_column(
        'positions',
        sa.Column(
            'salary',
            sa.Numeric(precision=10, scale=2),
            nullable=True
        )
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column('positions', 'salary')
    op.drop_column('positions', 'requirements')

    op.drop_column('companies', 'logo_url')
    op.drop_column('companies', 'description')
    op.drop_column('companies', 'industry')
    # ### end Alembic commands ###
