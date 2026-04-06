"""listing_applications: date_established, address, facilities

Revision ID: d4f1a2b3c4d5
Revises: c028c857e6af
Create Date: 2026-04-04
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "d4f1a2b3c4d5"
down_revision: Union[str, None] = "c028c857e6af"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "listing_applications",
        sa.Column("date_established", sa.Date(), nullable=True),
    )
    op.add_column(
        "listing_applications",
        sa.Column("address", sa.Text(), nullable=True),
    )
    op.add_column(
        "listing_applications",
        sa.Column(
            "facilities",
            postgresql.JSONB(astext_type=sa.Text()),
            server_default=sa.text("'[]'::jsonb"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column("listing_applications", "facilities")
    op.drop_column("listing_applications", "address")
    op.drop_column("listing_applications", "date_established")
