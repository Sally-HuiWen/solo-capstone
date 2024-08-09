from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', first_name='Demo', last_name='User', email='demo@aa.io', password='password', user_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/user-Demo-profile-image.png')
    marnie = User(
        username='marnie', first_name='Marnie', last_name='King', email='marnie@aa.io', password='password', user_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/user-Marnie-profile-image.png')
    bobbie = User(
        username='bobbie', first_name='Bobbie', last_name='Brown', email='bobbie@aa.io', password='password', user_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/user-Bobbie-profile-image.png')
    william= User(
        username='William', first_name='William', last_name='Davis', email='william@gmail.com', password='password', user_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/user-William-profile-image.jpeg')
    james = User(
        username='James', first_name='James', last_name='Lin', email='james@gmail.com', password='password', user_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/user-james-profile-image.png')
    juan = User(
        username='Juan', first_name='Juan', last_name='Cruz', email='juan@gmail.com', password='password', user_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/user-Juan-profile-image.png')
    amanda = User(
        username='Amanda', first_name='Amanda', last_name='Wilson', email='amanda@gmail.com', password='password', user_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/user-Amanda-profile-image.png')
    jessica = User(
        username='Jessica', first_name='Jessica', last_name='Johnson', email='Jessica@gmail.com', password='password', user_image_url='https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/user-Jessica-profile-image.png')
    
    all_users = [demo, marnie, bobbie, william, james, juan, amanda, jessica]
    [db.session.add(user) for user in all_users]
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
