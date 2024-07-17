from .db import db, environment, SCHEMA, add_prefix_for_prod

class DailyLogImage(db.Model):
    __tablename__ = 'daily_log_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key = True)
    daily_log_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("daily_logs.id")), unique=True)
    url = db.Column(db.String(2000), nullable = False)
   

    #one-to-one daily_logs(one)=>daily_log_images(many)
    daily_log = db.relationship(
        'DailyLog', 
        back_populates = 'daily_log_image',
    )

    def to_dict(self):
        return {
            'id': self.id,
            'daily_log_id': self.daily_log_id,
            'url': self.url,        
        }

    
