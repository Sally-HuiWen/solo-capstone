from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comments():
    comment1 = Comment(user_id=1, daily_log_id=1, comment='Happy birthday, Elsa!')
    comment2 = Comment(user_id=1, daily_log_id=5, comment='wow!')
    comment3 = Comment(user_id=1, daily_log_id=6, comment='adorable!')
    comment4 = Comment(user_id=1, daily_log_id=7, comment='cute!')
    comment5 = Comment(user_id=1, daily_log_id=8, comment='adorable!')
    comment6 = Comment(user_id=1, daily_log_id=9, comment='cute!')
    comment7 = Comment(user_id=1, daily_log_id=10, comment='adorable!')
    comment8 = Comment(user_id=2, daily_log_id=1, comment='cute!')
    comment9 = Comment(user_id=2, daily_log_id=2, comment='adorable!')
    comment10 = Comment(user_id=2, daily_log_id=3, comment='cute!')
    comment11 = Comment(user_id=2, daily_log_id=4, comment='adorable!')
    comment12 = Comment(user_id=2, daily_log_id=5, comment='cute!')
    comment13 = Comment(user_id=2, daily_log_id=9, comment='adorable!')
    comment14 = Comment(user_id=2, daily_log_id=10, comment='cute!')
    comment15 = Comment(user_id=3, daily_log_id=1, comment='adorable!')
    comment16 = Comment(user_id=3, daily_log_id=2, comment='cute!')
    comment17 = Comment(user_id=3, daily_log_id=3, comment='adorable!')
    comment18 = Comment(user_id=3, daily_log_id=4, comment='cute!')
    comment19 = Comment(user_id=3, daily_log_id=5, comment='adorable!')
    comment20 = Comment(user_id=3, daily_log_id=15, comment='cute!')

    comments = [comment1, comment2, comment3, comment4, comment5, comment6, comment7, comment8, comment9, comment10, comment11, comment12, comment13, comment14, comment15, comment16, comment17, comment18, comment19, comment20]
    [db.session.add(comment) for comment in comments]
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
        
    db.session.commit()