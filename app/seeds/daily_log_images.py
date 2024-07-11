from app.models import db, DailyLogImage, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

def seed_daily_log_images():
    daily_log_image1 = DailyLogImage(daily_log_id=1, url='image1', preview=True)
    daily_log_image2 = DailyLogImage(daily_log_id=2, url='image2', preview=True)
    daily_log_image3 = DailyLogImage(daily_log_id=3, url='image3', preview=True)
    daily_log_image4 = DailyLogImage(daily_log_id=4, url='image3', preview=True)
    daily_log_image5 = DailyLogImage(daily_log_id=5, url='image3', preview=True)
    daily_log_image6 = DailyLogImage(daily_log_id=6, url='image3', preview=True)
    daily_log_image7 = DailyLogImage(daily_log_id=7, url='image3', preview=True)
    daily_log_image8 = DailyLogImage(daily_log_id=8, url='image3', preview=True)
    daily_log_image9 = DailyLogImage(daily_log_id=9, url='image3', preview=True)
    daily_log_image10 = DailyLogImage(daily_log_id=10, url='image3', preview=True)
    daily_log_image11 = DailyLogImage(daily_log_id=11, url='image3', preview=True)
    daily_log_image12 = DailyLogImage(daily_log_id=12, url='image3', preview=True)
    daily_log_image13 = DailyLogImage(daily_log_id=13, url='image3', preview=True)
    daily_log_image14 = DailyLogImage(daily_log_id=14, url='image3', preview=True)
    daily_log_image15 = DailyLogImage(daily_log_id=15, url='image3', preview=True)
    daily_log_image16 = DailyLogImage(daily_log_id=16, url='image3', preview=True)

    daily_log_images = [daily_log_image1, daily_log_image2, daily_log_image3, daily_log_image4, daily_log_image5, daily_log_image6, daily_log_image7, daily_log_image8, daily_log_image9, daily_log_image10, daily_log_image11, daily_log_image12, daily_log_image13,daily_log_image14, daily_log_image15, daily_log_image16]
    [db.session.add(image) for image in daily_log_images]
    db.session.commit()


def undo_daily_log_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.daily_log_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM daily_log_images"))
        
    db.session.commit()