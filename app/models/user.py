from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .friend import friends
from .like import likes

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    first_name = db.Column(db.String(50), nullable = False)
    last_name = db.Column(db.String(50), nullable = False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    
    # one-to-many: user=>kids
    kids = db.relationship(
        'Kid',
        back_populates = 'user'
    )
    
    # many-to-many: users=>friends
    # user_friends represents the users that the current user has added as friends
    user_friends = db.relationship(
        'User',
        secondary = friends,
        primaryjoin = id == friends.c.user_id, # primaryjoin links current_user.id to friends table user_id column
        secondaryjoin = id == friends.c.friend_id, # secondaryjoin links related_user.id to friends table friend_id
        back_populates = 'friend_users' 

    )

    # many-to-many: friends=>users
    # represents the users who have added the current user as a friend.
    friend_users = db.relationship(
        'User',
        secondary = friends,
        primaryjoin = id == friends.c.friend_id, # primaryjoin links current_user.id to friends table friend_id
        secondaryjoin = id == friends.c.user_id, # secondaryjoin links related_user.id to friends table user_id
        back_populates = 'user_friends'
    )

    #one-to-many: users(one)=> comments(many)
    comments = db.relationship(
        'Comment',
        back_populates = 'user'
    )

    #many-to-many: users(many)<=>daily_logs(many)
    daily_logs = db.relationship(
        'DailyLog',
        secondary = likes,
        back_populates = 'users'
    )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'email': self.email,
            # 'user_friends': [friend.id for friend in self.user_friends]
            # 'friend_users': [friend.id for friend in self.friend_users]
        }
