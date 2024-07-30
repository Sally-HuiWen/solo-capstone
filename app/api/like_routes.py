from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Like, User, DailyLog, Kid, Friendship

like_routes = Blueprint('likes', __name__)

def are_friends(user_id1, user_id2):
    return Friendship.query.filter(
        ((Friendship.user_id == user_id1) and (Friendship.friend_id == user_id2)) or
        ((Friendship.user_id == user_id2) and (Friendship.friend_id == user_id1))
    ).count() > 0

@like_routes.route('/<int:daily_log_id>', methods=['POST'])
@login_required
def like_daily_log(daily_log_id):
    daily_log = DailyLog.query.get(daily_log_id)
    if not daily_log:
        return {'error': {'message': 'Daily log not found'}}, 404
    
    kid = Kid.query.get(daily_log.kid_id)
    if not kid:
        return {'error': {'message': 'kid not found'}}, 404

    if kid.user_id != current_user.id and not are_friends(current_user.id, kid.user_id):
        return {'error': {'message': 'You are not allowed to like this daily log'}}, 403

    like_exist = Like.query.filter_by(user_id=current_user.id, daily_log_id=daily_log_id).first()
    if like_exist:
        return {'error': {'message': 'You have already liked this daily log'}}, 400

    like = Like(user_id=current_user.id, daily_log_id=daily_log_id)
    db.session.add(like)
    db.session.commit()

    return like.to_dict(), 201

@like_routes.route('/<int:daily_log_id>', methods=['DELETE'])
@login_required
def unlike_daily_log(daily_log_id):
    like = Like.query.filter_by(user_id=current_user.id, daily_log_id=daily_log_id).first()
    if not like:
        return {'error': {'message': 'Like not found'}}, 404

    db.session.delete(like)
    db.session.commit()

    return {'message': 'Like removed'}, 200

@like_routes.route('/<int:daily_log_id>/usernames')
@login_required
def users_clicked_like(daily_log_id):
    likes = Like.query.filter_by(daily_log_id=daily_log_id).all()
    user_ids = [like.user_id for like in likes]
    users = User.query.filter(User.id.in_(user_ids)).all()
    user_usernames = [user.username for user in users]
    return {'user_usernames': user_usernames}, 200