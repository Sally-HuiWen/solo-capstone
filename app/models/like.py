from .db import db, environment, SCHEMA, add_prefix_for_prod

likes = db.Table(
    'likes',
    db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('daily_log_id', db.Integer,db.ForeignKey(add_prefix_for_prod('daily_logs.id')), primary_key=True),
)

if environment == "production":
    likes.schema = SCHEMA

