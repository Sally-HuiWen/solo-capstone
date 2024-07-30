from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .friendship import Friendship
from .like import Like
from sqlalchemy.orm import aliased
from sqlalchemy import or_

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
    
    def get_friends(self):
        UserAlias = aliased(User, name='user_alias')
        FriendAlias = aliased(User, name='friend_alias')
        friendships_query = ( # retrieves all friendships involving the current user.
            db.session.query(Friendship, UserAlias, FriendAlias)
            .outerjoin(UserAlias, Friendship.user_id == UserAlias.id)
            .outerjoin(FriendAlias, Friendship.friend_id == FriendAlias.id)
            .filter(#filters the query to include only the friendships where the current user is either the requester (user_id) or the recipient (friend_id).
                or_(
                    Friendship.user_id == self.id,
                    Friendship.friend_id == self.id
                ),
            )
        ).all()
        print(f'what is friends_query: {friendships_query}')

        pending_friends = []
        confirmed_friends = []

        for friendship, user_alias, friend_alias in friendships_query:
            if friendship.user_id == self.id:
                # The friend is a friend
                friend_info = {
                    'id': friend_alias.id,
                    'username': friend_alias.username,
                    'pending': friendship.pending,
                    'kids': [kid.to_dict() for kid in friend_alias.kids],
                }
            else:
                # User is a friend
                friend_info = {
                    'id': user_alias.id,
                    'username': user_alias.username,
                    'pending': friendship.pending,
                    'kids': [kid.to_dict() for kid in user_alias.kids],
                }

            if friendship.pending:
                pending_friends.append(friend_info)
            else:
                confirmed_friends.append(friend_info)

        return {
            'pending_friends': pending_friends,
            'confirmed_friends': confirmed_friends
        }

    # one-to-many: user=>kids
    kids = db.relationship(
        'Kid',
        back_populates = 'user',
        cascade = 'delete'
    )
    
    # many-to-many: users=>friends
    # user_friends represents the users that the current user has added as friends
    user_friends = db.relationship(
        'User',
        secondary = 'friendships',
        primaryjoin = id == Friendship.user_id, # primaryjoin links current_user.id to friendships table user_id column
        secondaryjoin = id == Friendship.friend_id, # secondaryjoin links related_user.id to friendships table friend_id
        back_populates = 'friend_users' 

    )

    # many-to-many: friends=>users
    # represents the users who have added the current user as a friend.
    friend_users = db.relationship(
        'User',
        secondary = 'friendships',
        primaryjoin = id == Friendship.friend_id, # primaryjoin links current_user.id to friends table friend_id
        secondaryjoin = id == Friendship.user_id, # secondaryjoin links related_user.id to friends table user_id
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
        secondary = 'likes',
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
            'kids': [kid.to_dict() for kid in self.kids],
            # 'user_friends': [friend.id for friend in self.user_friends] # List of IDs of the users this user has added as friends
            # 'friend_users': [user.id for user in self.friend_users]# List of IDs of the users who have added this user as a friend
        }
