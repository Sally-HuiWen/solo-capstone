from .db import db, environment, SCHEMA, add_prefix_for_prod

class Kid(db.Model):
    __tablename__ = 'kids'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    name = db.Column(db.String(50), nullable=False) 
    birth_date = db.Column(db.Date, nullable=False)
    relationship = db.Column(db.String(50), nullable=False)
    kid_image_url = db.Column(db.String(2000), nullable=False)
    
    # one-to-many: user(one)=>kids(many)
    user = db.relationship(
        'User',
        back_populates = 'kids'
    )

    #one-to-many: kid(one)=> daily_logs(many)
    daily_logs = db.relationship(
        'DailyLog',
        back_populates = 'kid',
        cascade='delete'
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'birth_date': self.birth_date,
            'relationship': self.relationship,
            'kid_image_url': self.kid_image_url,
        }
    