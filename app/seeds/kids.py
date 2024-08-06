from app.models import db, Kid, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import date

def seed_kids():
    kid1 = Kid(user_id=1, name ='Elsa', birth_date=date(2018,6,6), relationship='Mom', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Elsa-profile-image.png')
    kid2 = Kid(user_id=1, name ='Anna', birth_date=date(2020,7,7), relationship='Mom', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Anna-profile-image.png')
    kid3 = Kid(user_id=2, name ='Kristoff', birth_date=date(2018,8,8), relationship='Mom', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Kristoff-profile-image.png')
    kid4 = Kid(user_id=3, name ='Olaf', birth_date=date(2023,9,9), relationship='Dad', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Olaf-profile-image.png')
    kid5 = Kid(user_id=4, name ='Sophia', birth_date=date(2017,11,25), relationship='Dad', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Olaf-profile-image.png')
    kid6 = Kid(user_id=4, name ='Jerry', birth_date=date(2022,8,8), relationship='Dad', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Olaf-profile-image.png')
    kid7 = Kid(user_id=5, name ='Max', birth_date=date(2024,3,20), relationship='Dad', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Olaf-profile-image.png')
    kid8 = Kid(user_id=6, name ='Maria', birth_date=date(2017,10,30), relationship='Dad', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Olaf-profile-image.png')
    kid9 = Kid(user_id=6, name ='Carlos', birth_date=date(2019,1,9), relationship='Dad', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Olaf-profile-image.png')
    kid10 = Kid(user_id=6, name ='Luis', birth_date=date(2022,5,16), relationship='Dad', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Olaf-profile-image.png')
    kid11 = Kid(user_id=7, name ='Long', birth_date=date(2022,4,12), relationship='Mom', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Olaf-profile-image.png')
    kid12 = Kid(user_id=7, name ='Mia', birth_date=date(2023,12,24), relationship='Mom', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Olaf-profile-image.png')
    kid13 = Kid(user_id=8, name ='Emily', birth_date=date(2018,5,29), relationship='Mom', kid_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Olaf-profile-image.png')
    
    kids = [kid1, kid2, kid3, kid4, kid5, kid6, kid7, kid8, kid9, kid10, kid11, kid12, kid13]
    [db.session.add(kid) for kid in kids]
    db.session.commit()

def undo_kids():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.kids RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM kids"))
        
    db.session.commit()
