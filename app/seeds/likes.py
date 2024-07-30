from app.models import db, Like, environment, SCHEMA
from sqlalchemy.sql import text

def seed_likes():
    like1 = Like(user_id=1, daily_log_id=1)
    like2 = Like(user_id=1, daily_log_id=5)
    like3 = Like(user_id=1, daily_log_id=6)
    like4 = Like(user_id=1, daily_log_id=7)
    like5 = Like(user_id=1, daily_log_id=8)
    like6 = Like(user_id=1, daily_log_id=9)
    like7 = Like(user_id=1, daily_log_id=10)
    like8 = Like(user_id=2, daily_log_id=1)
    like9 = Like(user_id=2, daily_log_id=2)
    like10 = Like(user_id=2, daily_log_id=3)
    like11 = Like(user_id=2, daily_log_id=4)
    like12 = Like(user_id=2, daily_log_id=5)
    like13 = Like(user_id=2, daily_log_id=9)
    like14 = Like(user_id=2, daily_log_id=10)
    like15 = Like(user_id=3, daily_log_id=1)
    like16 = Like(user_id=3, daily_log_id=1)
    like17 = Like(user_id=3, daily_log_id=2)
    like18 = Like(user_id=3, daily_log_id=3)
    like19 = Like(user_id=3, daily_log_id=4)
    like20 = Like(user_id=3, daily_log_id=15)


    
    likes = [like1, like2, like3, like4, like5, like6, like7, like8, like9, like10, like11, like12, like13, like14, like15, like16, like17, like18, like19, like20]
    [db.session.add(like) for like in likes]
    db.session.commit()

def undo_likes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.likes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM likes"))
        
    db.session.commit()
