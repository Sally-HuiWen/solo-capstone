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

    new_friendship = Friendship(user_id=user_id, friend_id=friend_id, status ='pending')
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
    new_status = data.get('status')
    
    if new_status not in ['accepted', 'denied']:
        return {'errors': {'message': 'Invalid status update'}}, 400
    
    friendship = Friendship.query.get(friendship_id)
    
    # Check if friendship already exists
    if not friendship:
        return {'errors': {'message': 'Friendship not found'}}, 404
    
    # check if the current_user is the recipient of the friend request
    if current_user.id != friendship.friend_id:
        return {'errors': {'message': 'Only the recipient can update the friend request status'}}, 403
    
    friendship.status = new_status
    db.session.commit()
    return friendship.to_dict(), 200

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
    if current_user.id != friendship.user_id and current_user.id !=friendship.friend_id:
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    db.session.delete(friendship)
    db.session.commit()
    
    return {'message': 'Friendship deleted successfully'}, 200

@friendship_routes.route('/current')
@login_required
def get_current_user_friendships():
    """
    Get all friendships of the current logged-in user
    """
    user_id = current_user.id

    # get friendships where the current user is either the sender or the recipient; do Not forget to use or_; otherwise, not working
    friendships = Friendship.query.filter(
        or_(Friendship.user_id == user_id, Friendship.friend_id == user_id)
    ).all()

    friendships_list = [friendship.to_dict() for friendship in friendships]

    return (friendships_list), 200


