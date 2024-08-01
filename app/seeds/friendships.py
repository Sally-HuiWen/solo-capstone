from app.models import db, Friendship, environment, SCHEMA
from sqlalchemy.sql import text

def seed_friendships():
    friendship1 = Friendship(user_id=1, friend_id=2, status='accepted')
    friendship2 = Friendship(user_id=1, friend_id=3, status='accepted')
    friendship3 = Friendship(user_id=2, friend_id=3, status='accepted')
    
    friendships = [friendship1, friendship2, friendship3]
    [db.session.add(friendship) for friendship in friendships]
    db.session.commit()

def undo_friendships():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friendships RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friendships"))
        
    db.session.commit()
