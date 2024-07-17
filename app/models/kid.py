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

    #one-to-many: kid(one)=> development_records(many)
    development_records = db.relationship(
        'DevelopmentRecord',
        back_populates = 'kid'
    )



    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'birth_date': self.birth_date,
            'relationship': self.relationship,
        }
    
    #Adding the user and daily_logs to the to_dict method 
    #def to_dict(self, include_user=False, include_daily_logs=False):
    # kid_dict = {
    #     'id': self.id,
    #     'user_id': self.user_id,
    #     'name': self.name,
    #     'birth_date': self.birth_date,
    #     'relationship': self.relationship,
    # }

    # if include_user:
    #     kid_dict['user'] = self.user.to_dict() if self.user else None

    # if include_daily_logs:
    #     kid_dict['daily_logs'] = [log.to_dict() for log in self.daily_logs]

    # return kid_dict