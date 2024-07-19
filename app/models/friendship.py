from .db import db, environment, SCHEMA, add_prefix_for_prod

friendships = db.Table(
    'friendships',
    db.Model.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('friend_id', db.Integer,db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('status', db.String(20),nullable=False, default='pending')
)

if environment == "production":
    friendships.schema = SCHEMA

