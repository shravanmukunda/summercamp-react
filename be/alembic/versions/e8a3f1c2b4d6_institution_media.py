"""institution_media table for R2-backed gallery and hero poster

Revision ID: e8a3f1c2b4d6
Revises: d4f1a2b3c4d5
Create Date: 2026-04-04
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "e8a3f1c2b4d6"
down_revision: Union[str, None] = "d4f1a2b3c4d5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "institution_media",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("institution_id", sa.String(length=200), nullable=False),
        sa.Column("kind", sa.String(length=20), nullable=False),
        sa.Column("object_key", sa.String(length=1024), nullable=False),
        sa.Column("poster_key", sa.String(length=1024), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["institution_id"],
            ["institutions.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_institution_media_institution_id",
        "institution_media",
        ["institution_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_institution_media_institution_id", table_name="institution_media")
    op.drop_table("institution_media")
