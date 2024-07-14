from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .like import likes

class DailyLog(db.Model):
    __tablename__ = 'daily_logs'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    kid_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("kids.id")))
    content = db.Column(db.String(2000),nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    #one-to-many: kid(one)=> daily_logs(many)
    kid = db.relationship(
        'Kid',
        back_populates = 'daily_logs'

    )#one-to-many: daily_logs(one)=>daily_log_images(many)
    daily_log_images = db.relationship(
        'DailyLogImage',
        back_populates = 'daily_log'
    )

    #one-to-many: daily_logs(one)=> comments(many)
    comments = db.relationship(
        'Comment',
        back_populates = 'daily_log'
    )
    
    #many-to-many: users(many)<=>daily_logs(many)
    users = db.relationship(
        'User',
        secondary = likes,
        back_populates = 'daily_logs'
    )



    def to_dict(self):
        return {
            'id': self.id,
            'kid_id': self.kid_id,
            'content': self.content,
            'created_at': self.created_at.strftime("%a, %d %b %Y"),#display as Sat, 15 Jul 2023 instead of Sat, 15 Jul 2023 00:00:00 GMT
            'images': [image.to_dict() for image in self.daily_log_images] if self.daily_log_images else [],
        }