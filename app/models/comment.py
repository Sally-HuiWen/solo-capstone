from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    daily_log_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("daily_logs.id")))
    comment = db.Column(db.String(255), nullable = False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    #one-to-many: users(one)=> comments(many)
    user = db.relationship(
        'User',
        back_populates = 'comments'
    )

    #one-to-many: daily_logs(one)=> comments(many)
    daily_log = db.relationship(
        'DailyLog',
        back_populates = 'comments'
    )
  
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'daily_log_id': self.daily_log_id,
            'comment': self.comment,
            'created_at': self.created_at,
        }


