from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.schema import UniqueConstraint

class Friendship(db.Model):
    __tablename__ = 'friendships'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    status = db.Column(db.String, nullable=False, default='pending')
    
    __table_args__ = (
        UniqueConstraint('user_id', 'friend_id', name='uq_user_friend'),
    )

    if environment == "production":
        __table_args__ = (
            UniqueConstraint('user_id', 'friend_id', name='uq_user_friend'),
            {'schema': SCHEMA}
        )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'friend_id': self.friend_id,
            'status': self.status
        }

