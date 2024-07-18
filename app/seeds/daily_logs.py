from app.models import db, DailyLog, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_daily_logs():
    daily_log1 = DailyLog(kid_id=1, title = 'Six-year-old Birthday Party', content ='ELsa invited all her kindergarten classmates to attend her birthday party. She had so much fun', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image1-Elsa-birthday-party.png', created_at=datetime(2024,6,6))
    daily_log2 = DailyLog(kid_id=1, title = 'First Day of Kindergarten', content ='First day of kindergarten! She is a elementary student now! ', image_url= 'https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image2-elsa-first-day-of-kindergarten.png', created_at=datetime(2023,8,16))
    daily_log3 = DailyLog(kid_id=1, title = 'Running Near Carmel-by-the-sea', content ='chasing waves near the beautiful beach!', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image3-elsa-chase-waves.png', created_at=datetime(2023,7,15))
    daily_log4 = DailyLog(kid_id=1, title = 'Ice-skating Progress ', content ='ELsa just unlock the skill of  backward crossover! ', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image4-elsa-iceskating.png', created_at=datetime(2023,5,20))
    daily_log5 = DailyLog(kid_id=2, title = 'Ballet Performance', content ='Well done with your first ballet performance, Anna!', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image5-anna-ballet.png', created_at=datetime(2024,6,2))
    daily_log6 = DailyLog(kid_id=2, title = 'Raining Day', content ='jumping muddy puddles under the rain', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image6-anna-muddy-puddles.png', created_at=datetime(2024,3,18))
    daily_log7 = DailyLog(kid_id=2, title = 'Show Time', content ='Enjoying  disney on ice show!', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image7-anna-watcing-show.png', created_at=datetime(2023,11,3))
    daily_log8 = DailyLog(kid_id=2, title = 'Park Fun', content ='Grilling marshmallows in the park ', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image8-anna-in-the-park.png', created_at=datetime(2023,10,6))
    daily_log9 = DailyLog(kid_id=3, title = 'Spending time with friends', content ='Play date with your best friend!', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image9-Kristoff-playdate.png', created_at=datetime(2024,6,5))
    daily_log10 = DailyLog(kid_id=3, title = 'Soccer', content ='Kristoff is playing soccer!', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image10-Kirstoff-play-soccer.png', created_at=datetime(2024,5,19))
    daily_log11 = DailyLog(kid_id=3, title = 'Running with Daddy', content ='Kristoff is running with Daddy', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image11-Kristoff-running-with-Dad.png', created_at=datetime(2024,3,21))
    daily_log12 = DailyLog(kid_id=3, title = 'Puppies', content ="Kristoff is patting our neighbor's puppies", image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image12-Kristoff-pat-puppies.png', created_at=datetime(2024,3,10))
    daily_log13 = DailyLog(kid_id=4, title = 'First Step', content ="Olaf's first step! This little one could walk now!", image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image13-Olaf-first-step.png', created_at=datetime(2024,6,9))
    daily_log14 = DailyLog(kid_id=4, title = 'Who is crawling now', content ='first crawling, go Olaf!', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image14-Olaf-start-crawling.png', created_at=datetime(2024,2,7))
    daily_log15 = DailyLog(kid_id=4, title = 'Smile', content ="Olaf's first cute smile!", image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image15-Olaf-first-smail.png', created_at=datetime(2023,10,6))
    daily_log16 = DailyLog(kid_id=4, title = 'Birth', content ='Welcome to this beautiful world!', image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/image16-Olaf-welcome.png', created_at=datetime(2023,9,9))
    
    daily_logs = [daily_log1, daily_log2, daily_log3, daily_log4, daily_log5, daily_log6,daily_log7,daily_log8,daily_log9,daily_log10,daily_log11,daily_log12,daily_log13,daily_log14,daily_log15,daily_log16]
    [db.session.add(log) for log in daily_logs]
    db.session.commit()

def undo_daily_logs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.daily_logs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM daily_logs"))
        
    db.session.commit()
