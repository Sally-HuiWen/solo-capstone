from app.models import db, DailyLog, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_daily_logs():
    daily_log1 = DailyLog(kid_id=1, content ='ELsa invited all her kindergarten classmates to attend her birthday party. She had so much fun', created_at=datetime(2024,6,6))
    daily_log2 = DailyLog(kid_id=1, content ='First day of kindergarten! She is a elementary student now! ', created_at=datetime(2023,8,16))
    daily_log3 = DailyLog(kid_id=1, content ='chasing waves near the beautiful beach!', created_at=datetime(2023,7,15))
    daily_log4 = DailyLog(kid_id=1, content ='ELsa just unlock the skill of  backward crossover! ', created_at=datetime(2023,5,20))
    daily_log5 = DailyLog(kid_id=2, content ='Well done with your first ballet performance, Anna!', created_at=datetime(2024,6,2))
    daily_log6 = DailyLog(kid_id=2, content ='jumping muddy puddles under the rain', created_at=datetime(2024,3,18))
    daily_log7 = DailyLog(kid_id=2, content ='Enjoying  disney on ice show!', created_at=datetime(2023,11,3))
    daily_log8 = DailyLog(kid_id=2, content ='Grilling marshmallows in the park ', created_at=datetime(2023,10,6))
    daily_log9 = DailyLog(kid_id=3, content ='Play date with your best friend!', created_at=datetime(2024,6,5))
    daily_log10 = DailyLog(kid_id=3, content ='Kristoff is playing soccer!', created_at=datetime(2024,5,19))
    daily_log11 = DailyLog(kid_id=3, content ='Kristoff is chasing after Daddy', created_at=datetime(2024,3,21))
    daily_log12 = DailyLog(kid_id=3, content ="Kristoff is patting our neighbor's puppies", created_at=datetime(2024,3,10))
    daily_log13 = DailyLog(kid_id=4, content ="Olaf's first step! This little one could walk now!", created_at=datetime(2024,6,9))
    daily_log14 = DailyLog(kid_id=4, content ='first crawling, go Olaf!', created_at=datetime(2024,2,7))
    daily_log15 = DailyLog(kid_id=4, content ="Olaf's first cute smile!", created_at=datetime(2023,10,6))
    daily_log16 = DailyLog(kid_id=4, content ='Welcome to this beautiful world!', created_at=datetime(2023,9,9))
    
    daily_logs = [daily_log1, daily_log2, daily_log3, daily_log4, daily_log5, daily_log6,daily_log7,daily_log8,daily_log9,daily_log10,daily_log11,daily_log12,daily_log13,daily_log14,daily_log15,daily_log16]
    [db.session.add(log) for log in daily_logs]
    db.session.commit()

def undo_daily_logs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.daily_logs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM daily_logs"))
        
    db.session.commit()
