"""create 6 tables

Revision ID: 4625f3f60969
Revises: 
Create Date: 2024-08-06 15:54:36.409856

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '4625f3f60969'
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
    sa.Column('user_image_url', sa.String(length=2000), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('friendships',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('friend_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['friend_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id', 'friend_id', name='uq_user_friend')
    )
    op.create_table('kids',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('birth_date', sa.Date(), nullable=False),
    sa.Column('relationship', sa.String(length=50), nullable=False),
    sa.Column('kid_image_url', sa.String(length=2000), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('daily_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('kid_id', sa.Integer(), nullable=True),
    sa.Column('title', sa.String(length=50), nullable=False),
    sa.Column('content', sa.String(length=2000), nullable=False),
    sa.Column('image_url', sa.String(length=2000), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['kid_id'], ['kids.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('daily_log_id', sa.Integer(), nullable=False),
    sa.Column('comment', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['daily_log_id'], ['daily_logs.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('likes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('daily_log_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['daily_log_id'], ['daily_logs.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE friendships SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE kids SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE daily_logs SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE comments SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE likes SET SCHEMA {SCHEMA};")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('likes')
    op.drop_table('comments')
    op.drop_table('daily_logs')
    op.drop_table('kids')
    op.drop_table('friendships')
    op.drop_table('users')
    # ### end Alembic commands ###