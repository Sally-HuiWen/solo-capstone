from .db import db, environment, SCHEMA, add_prefix_for_prod
from .like import likes

class DailyLogImage(db.Model):
    __tablename__ = 'daily_log_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key = True)
    daily_log_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("daily_logs.id")))
    url = db.Column(db.String(2000), nullable = False)
    preview = db.Column(db.Boolean, nullable = False, default = False)

    #one-to-many daily_logs(one)=>daily_log_images(many)
    daily_log = db.relationship(
        'DailyLog',
        back_populates = 'daily_log_images'
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
            'daily_log_id': self.daily_log_id,
            'url': self.url,
            'preview': self.preview           
        }

    
