from app.models import db, Kid, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

def seed_kids():
    kid1 = Kid(user_id=1, name ='Elsa', birthday=date(2018,6,6), relationship='Mom')
    kid2 = Kid(user_id=1, name ='Anna', birthday=date(2020,7,7), relationship='Mom')
    kid3 = Kid(user_id=2, name ='Kristoff', birthday=date(2018,8,8), relationship='Mom')
    kid4 = Kid(user_id=3, name ='Olaf', birthday=date(2023,9,9), relationship='Dad')

    kids = [kid1, kid2, kid3, kid4]
    [db.session.add(kid) for kid in kids]
    db.session.commit()

def undo_kids():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.kids RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM kids"))
        
    db.session.commit()
