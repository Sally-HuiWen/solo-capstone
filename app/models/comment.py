from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    daily_log_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("daily_logs.id")), nullable=False)
    comment = db.Column(db.String(255), nullable = False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relationship to User and DailyLog
    user = db.relationship('User', back_populates='comments')
    daily_log = db.relationship('DailyLog', back_populates='comments')
  
    def to_dict(self):
        user = self.user 
        return {
            'id': self.id,
            'user_id': self.user_id,
            'daily_log_id': self.daily_log_id,
            'comment': self.comment,
            'created_at': self.created_at,
            'user': {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_image_url': user.user_image_url
            }
        }


