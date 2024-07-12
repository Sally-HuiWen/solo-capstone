"""create eight tables

Revision ID: c70a4ca8bf9e
Revises: 
Create Date: 2024-07-11 06:10:33.187579

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = 'c70a4ca8bf9e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('first_name', sa.String(length=50), nullable=False),
    sa.Column('last_name', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('friends',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('friend_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'friend_id')
    )
    op.create_table('kids',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('birth_date', sa.Date(), nullable=False),
    sa.Column('relationship', sa.String(length=50), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('daily_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('kid_id', sa.Integer(), nullable=True),
    sa.Column('content', sa.String(length=2000), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['kid_id'], ['kids.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('development_records',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('kid_id', sa.Integer(), nullable=True),
    sa.Column('height', sa.Numeric(), nullable=False),
    sa.Column('weight', sa.Numeric(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['kid_id'], ['kids.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('daily_log_id', sa.Integer(), nullable=True),
    sa.Column('comment', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['daily_log_id'], ['daily_logs.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('daily_log_images',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('daily_log_id', sa.Integer(), nullable=True),
    sa.Column('url', sa.String(length=2000), nullable=False),
    sa.Column('preview', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['daily_log_id'], ['daily_logs.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('likes',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('daily_log_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['daily_log_id'], ['daily_logs.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'daily_log_id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE friends SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE kids SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE daily_logs SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE development_records SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE comments SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE daily_log_images SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE likes SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('likes')
    op.drop_table('daily_log_images')
    op.drop_table('comments')
    op.drop_table('development_records')
    op.drop_table('daily_logs')
    op.drop_table('kids')
    op.drop_table('friends')
    op.drop_table('users')
    # ### end Alembic commands ###
