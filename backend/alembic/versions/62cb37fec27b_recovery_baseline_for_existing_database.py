"""recovery baseline for existing database

Revision ID: 62cb37fec27b
Revises: bbeb525eda57
Create Date: 2026-09-22 01:34:06.727597

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '62cb37fec27b'
down_revision: Union[str, Sequence[str], None] = 'bbeb525eda57'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
