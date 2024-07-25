from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, User, Friendship
from sqlalchemy import or_, and_

friendship_routes = Blueprint('friendships', __name__)

@friendship_routes.route('/new', methods=['POST'])
@login_required
def create_friendship():
    """
    send a friend request to another user by current logged-in user
    """
    data = request.get_json()
    user_id = current_user.id
    friend_id = data.get('friend_id')

    # Check if the friend is the current user
    if user_id == friend_id:
        return {'errors': {'message': 'You cannot send a friend request to yourself'}}, 400
    
    # check if the friend exists
    friend = User.query.get(friend_id)
    
    if not friend:
        return {'errors': {'message': 'Friend not found'}}, 404

    # Check if friendship already exists
    existing_friendship = Friendship.query.filter(
        or_(
            and_(Friendship.user_id == user_id, Friendship.friend_id == friend_id),
            and_(Friendship.user_id == friend_id, Friendship.friend_id == user_id)
        )
    ).first()
    
    if existing_friendship:
        return {'errors': {'message': 'friendship already exists'}}, 400

    new_friendship = Friendship(user_id=user_id, friend_id=friend_id)
    db.session.add(new_friendship)
    db.session.commit()
    
    return new_friendship.to_dict(), 201

@friendship_routes.route('/<int:friendship_id>')
@login_required
def get_friendship(friendship_id):
    """
    get friendship information by friendship_id by current logged-in user(only if current_user is user or friend can retrieve the info)
    """
    friendship = Friendship.query.get(friendship_id)

    # Check if friendship already exists
    if not friendship:
        return {'errors': {'message': 'Friendship not found'}}, 404
    
    # check if the current_user is either the user_id or friend_id in the friendship
    if current_user.id not in [friendship.user_id, friendship.friend_id]:
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    return friendship.to_dict(), 200

@friendship_routes.route('/<int:friendship_id>/update', methods=['PUT'])
@login_required
def update_friendship(friendship_id):
    """
    Update pending from true to false by current logged-in user 
    """
    data = request.get_json()
    friendship = Friendship.query.get(friendship_id)
    
    # Check if friendship already exists
    if not friendship:
        return {'errors': {'message': 'Friendship not found'}}, 404
    
    # check if the current_user is either the user_id or friend_id in the friendship
    if current_user.id not in [friendship.user_id, friendship.friend_id]:
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    # Only allow the friend_id to change the pending status from true to false
    if current_user.id == friendship.friend_id:
        if friendship.pending:
            friendship.pending = False
            db.session.commit()
            return friendship.to_dict(), 200
        else:
            return {'errors': {'message': 'Friendship is already confirmed'}}, 400
    else:
        return {'errors': {'message': 'Only the recipient can accept the friend request'}}, 403

@friendship_routes.route('/<int:friendship_id>', methods=['DELETE'])
@login_required
def delete_friendship(friendship_id):
    """
    delete friendship by friendship_id by current logged-in user(decline friend request or delete confirmed relationship)
    """
    friendship = Friendship.query.get(friendship_id)
    
    # Check if friendship already exists
    if not friendship:
        return {'errors': {'message': 'Friendship not found'}}, 404
    
    # check if the current_user is either the user_id or friend_id in the friendship
    if current_user.id not in [friendship.user_id, friendship.friend_id]:
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    db.session.delete(friendship)
    db.session.commit()
    
    return {'message': 'Friendship deleted successfully'}, 200

# from flask import Blueprint, request, jsonify
# from flask_login import login_required, current_user
# from app.models import friendships, DailyLog, User, Kid,db

# friendship_routes = Blueprint('friend_routes', __name__)

# @friendship_routes.route('/send_request', methods=['POST'])
# @login_required
# def send_friend_request():
#     """
#     send a friend request to another user by current logged-in user(A send request to B)
#     """
#     friend_id = request.json.get('friend_id')
#     if not friend_id:
#         return {"error": "friend id is required"}, 400

#     # Check if the friend exists
#     friend = User.query.get(friend_id)
#     if not friend:
#         return {"error": "User does not exist"}, 404
    
#     # Check if the friendship already exists(eg.other user send friend request to current user)
#     existing_friendship = db.session.query(friendships).filter(
#         ((friendships.c.user_id == current_user.id) and (friendships.c.friend_id == friend_id)) or
#         ((friendships.c.user_id == friend_id) and (friendships.c.friend_id == current_user.id))
#     ).first()
#     if existing_friendship:
#         return {"error": f"You have friendship with this user and the status is {existing_friendship.status}"}, 400

#     # Check if the current user already sent a friend request 
#     existing_request = db.session.query(friendships).filter_by(user_id=current_user.id, friend_id=friend_id).first()
#     if existing_request:
#         return {"error": "friend request already sent"}, 400

#     # Insert the friend request into the friends table
#     new_request = friendships.insert().values(user_id=current_user.id, friend_id=friend_id, status='pending')
#     db.session.execute(new_request)
#     db.session.commit()

#     print(f"User {current_user.id} send friend request to User {friend_id}")
#     return {"message": "Friend request sent successfully!"}, 200

# @friendship_routes.route('/sending_pending_requests_users')
# @login_required
# def get_pending_friend_requests():
#     """
#     get all pending requests sent by other users and received by current logged-in user(status:pending)
#     """
#     pending_requests = db.session.query(User).join(
#         friendships, User.id == friendships.c.user_id  #looking for users that send requests
#     ).filter(
#         friendships.c.friend_id == current_user.id, #he current user is the recipient of the friend request
#         friendships.c.status == 'pending'
#     ).all() # all results as a list of User objects who have sent pending friend requests to the current user.

#     pending_request_dict = [
#         {
#             "id": user.id,
#             "username": user.username,
#             "first_name": user.first_name,
#             "last_name": user.last_name,
#             "email": user.email
#         }
#         for user in pending_requests]
#     return pending_request_dict, 200 # users list that send pending requests to current user

# @friendship_routes.route('/friends')
# @login_required
# def get_friends():
#     """
#     get all friends of current logged-in user(status:'accepted', the current user send friend requests to other users and got accepted response)
#     """
#     friends = db.session.query(User).join(
#         friendships, User.id == friendships.c.friend_id #looking for users that received friend requests;The c attribute of a Table object in SQLAlchemy is a shorthand for columns
#     ).filter(
#         friendships.c.user_id == current_user.id,  #he current user is the sender of the friend request
#         friendships.c.status == 'accepted'
#     ).all()

#     #This list comprehension transforms each User object into a dictionary containing only the necessary attributes.
#     friends_dict = [
#         {
            
#             "id": user.id,
#             "username": user.username,
#             "first_name": user.first_name,
#             "last_name": user.last_name,
#             "email": user.email,
#             "kids": [kid.to_dict() for kid in user.kids]
#         }
#         for user in friends
#     ]
    
#     return friends_dict, 200 # users list that received friend request from current user and accepted
#     #jsonify converts the friends_dict list of dictionaries into a JSON response.
#     # Flask will automatically convert dictionaries and lists to JSON when they are returned from a route, even if you don't explicitly use jsonify

# @friendship_routes.route('/friends/<int:kid_id>')
# @login_required
# def get_friends_kid_details():
#      """
#     Get a kid details by a friend's kid id for the current logged-in user
#     """





# @friendship_routes.route('/friends/<int:kid_id>/daily_logs')
# @login_required
# def get_friends_kids_daily_logs(kid_id):
#     """
#     Get all daily logs for a specific kid by a friend's kid for the current logged-in user
#     """
#     # Get the kid by ID
#     kid = Kid.query.get(kid_id)
#     if kid is None:
#         return {'errors': {'message': 'Kid not found'}}, 404

#     # Check if the current user is friends with the kid's parent/guardian
#     friendship = db.session.query(friendships).filter(
#         (friendships.c.user_id == current_user.id) and (friendships.c.friend_id == kid.user_id) 
#     ).filter(friendship.status == 'accepted').first()

#     if friendship is None:
#         return {'errors': {'message': 'You are not authorized'}}, 403

#     # Fetch and sort daily logs
#     all_daily_logs = DailyLog.query.filter_by(kid_id=kid_id).order_by(DailyLog.created_at.desc()).all()
#     return {'daily_logs': [log.to_dict() for log in all_daily_logs]}, 200
    
# @friendship_routes.route('/respond_to_request', methods=['PUT'])
# @login_required
# def respond_to_friend_request():
#     """
#     respond to a friend request (accept or decline) by the current logged-in user
#     """
#     friend_id = request.json.get('friend_id')
#     action = request.json.get('action')  

#     if not friend_id or action not in ['accept', 'decline']:
#         return {"error": "friend id and action are required"}, 400

#     friend_request = db.session.query(friendships).filter_by(user_id=friend_id, friend_id=current_user.id).first()
#     if not friend_request:
#         return {"error": "friend request not found"}, 404

#     if action == 'accept':
#         db.session.execute(
#             friendships.update().where(
#                 friendships.c.user_id == friend_id,
#                 friendships.c.friend_id == current_user.id
#             ).values(status='accepted')
#         )
#         db.session.commit()
#         return {"message": "Friend request accepted successfully!"}, 200
#     elif action == 'decline':
#         db.session.execute(
#             friendships.delete().where(
#                 friendships.c.user_id == friend_id,
#                 friendships.c.friend_id == current_user.id
#             )
#         )
#         db.session.commit()
#         return {"message": "Friend request declined successfully!"}, 200
    
# @friendship_routes.route('/delete_friend', methods=['DELETE'])
# @login_required
# def delete_friend():
#     """
#     delete a friend from the current logged-in user's friend list(delete the friendship)
#     """
#     friend_id = request.json.get('friend_id')
#     if not friend_id:
#         return {"error": "friend id is required"}, 400

#     delete_friendship = db.session.query(friendships).filter(
#         (friendships.c.user_id == current_user.id) & (friendships.c.friend_id == friend_id) |
#         (friendships.c.user_id == friend_id) & (friendships.c.friend_id == current_user.id)
#     ).first()

#     if not delete_friendship:
#         return {"error": "Friendship not found"}, 404

#     db.session.execute(
#         friendships.delete().where(
#             (friendships.c.user_id == current_user.id) & (friendships.c.friend_id == friend_id) |
#             (friendships.c.user_id == friend_id) & (friendships.c.friend_id == current_user.id)
#         )
#     )
#     db.session.commit()

#     return {"message": "Friendship removed successfully!"}, 200