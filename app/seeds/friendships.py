from app.models import db, friendships, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

def seed_friendships():
    friendship_values = [
        {'user_id': 1, 'friend_id': 2, 'status': 'accepted'},
        {'user_id': 1, 'friend_id': 3, 'status': 'accepted'},
        {'user_id': 2, 'friend_id': 3, 'status': 'pending'},
    ]
    db.session.execute(friendships.insert(), friendship_values)
    db.session.commit()

def undo_friendships():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friendships RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friendships"))
        
    db.session.commit()
