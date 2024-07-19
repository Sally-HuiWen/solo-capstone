from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import friendships, User, db

friendship_routes = Blueprint('friend_routes', __name__)

@friendship_routes.route('/send_request', methods=['POST'])
@login_required
def send_friend_request():
    """
    send a friend request to another user by current logged-in user(A send request to B)
    """
    friend_id = request.json.get('friend_id')
    if not friend_id:
        return {"error": "friend id is required"}, 400

    # Check if the friend exists
    friend = User.query.get(friend_id)
    if not friend:
        return {"error": "User does not exist"}, 404
    
    # Check if the friendship already exists
    existing_friendship = db.session.query(friendships).filter(
        ((friendships.c.user_id == current_user.id) and (friendships.c.friend_id == friend_id)) or
        ((friendships.c.user_id == friend_id) and (friendships.c.friend_id == current_user.id))
    ).first()
    if existing_friendship:
        return {"error": "You are already friends with this user"}, 400

    # Check if the current user already sent a friend request 
    existing_request = db.session.query(friendships).filter_by(user_id=current_user.id, friend_id=friend_id).first()
    if existing_request:
        return {"error": "friend request already sent"}, 400

    # Insert the friend request into the friends table
    new_request = friendships.insert().values(user_id=current_user.id, friend_id=friend_id, status='pending')
    db.session.execute(new_request)
    db.session.commit()

    print(f"Friend request sent from User {current_user.id} to User {friend_id}")
    return {"message": "Friend request sent successfully!"}, 200

@friendship_routes.route('/pending_requests_received')
@login_required
def get_pending_friend_requests():
    """
    get all pending requests sent by other users and received by current logged-in user(status:pending; received only)
    """
    pending_requests = db.session.query(User).join(
        friendships, User.id == friendships.c.user_id
    ).filter(
        friendships.c.friend_id == current_user.id,
        friendships.c.status == 'pending'
    ).all()

    pending_dict = [
        {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        }
        for user in pending_requests]
    return pending_dict, 200

@friendship_routes.route('/friends')
@login_required
def get_friends():
    """
    get all friends of current logged-in user(status:'accepted')
    """
    #This query retrieves all User objects that are "friends" with the current user and have accepted the friend request.
    friends = db.session.query(User).join(
        friendships, User.id == friendships.c.friend_id #The c attribute of a Table object in SQLAlchemy is a shorthand for columns
    ).filter(
        friendships.c.user_id == current_user.id,
        friendships.c.status == 'accepted'
    ).all()

    #This list comprehension transforms each User object into a dictionary containing only the necessary attributes.
    friends_dict = [
        {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        }
        for user in friends
    ]
    
    return jsonify(friends_dict), 200
    #jsonify converts the friends_dict list of dictionaries into a JSON response.
    # Flask will automatically convert dictionaries and lists to JSON when they are returned from a route, even if you don't explicitly use jsonify

@friendship_routes.route('/respond_to_request', methods=['PUT'])
@login_required
def respond_to_friend_request():
    """
    respond to a friend request (accept or decline) by the current logged-in user
    """
    friend_id = request.json.get('friend_id')
    action = request.json.get('action')  

    if not friend_id or action not in ['accept', 'decline']:
        return {"error": "friend id and action are required"}, 400

    friend_request = db.session.query(friendships).filter_by(user_id=friend_id, friend_id=current_user.id).first()
    if not friend_request:
        return {"error": "friend request not found"}, 404

    if action == 'accept':
        db.session.execute(
            friendships.update().where(
                friendships.c.user_id == friend_id,
                friendships.c.friend_id == current_user.id
            ).values(status='accepted')
        )
        db.session.commit()
        return {"message": "Friend request accepted successfully!"}, 200
    elif action == 'decline':
        db.session.execute(
            friendships.delete().where(
                friendships.c.user_id == friend_id,
                friendships.c.friend_id == current_user.id
            )
        )
        db.session.commit()
        return {"message": "Friend request declined successfully!"}, 200
    
@friendship_routes.route('/delete_friend', methods=['DELETE'])
@login_required
def delete_friend():
    """
    delete a friend from the current logged-in user's friend list(delete the friendship)
    """
    friend_id = request.json.get('friend_id')
    if not friend_id:
        return {"error": "friend id is required"}, 400

    delete_friendship = db.session.query(friendships).filter(
        (friendships.c.user_id == current_user.id) & (friendships.c.friend_id == friend_id) |
        (friendships.c.user_id == friend_id) & (friendships.c.friend_id == current_user.id)
    ).first()

    if not delete_friendship:
        return {"error": "Friendship not found"}, 404

    db.session.execute(
        friendships.delete().where(
            (friendships.c.user_id == current_user.id) & (friendships.c.friend_id == friend_id) |
            (friendships.c.user_id == friend_id) & (friendships.c.friend_id == current_user.id)
        )
    )
    db.session.commit()

    return {"message": "Friendship removed successfully!"}, 200