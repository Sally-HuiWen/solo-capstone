from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class DevelopmentRecord(db.Model):
    __tablename__ = 'development_records'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    kid_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("kids.id")))
    height = db.Column(db.Numeric,nullable=False)
    weight = db.Column(db.Numeric,nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    #one-to-many: kid(one)=> development_records(many)
    kid = db.relationship(
        'Kid',
        back_populates = 'development_records'
    )

    def to_dict(self):
        return {
            'id': self.id,
            'kid_id': self.kid_id,
            'height': self.height,
            'weight': self.weight,
            'created_at': self.created_at,
        }
                