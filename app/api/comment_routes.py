from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Comment, Kid, DailyLog, Friendship
from app.forms import CommentForm
from datetime import datetime

comment_routes = Blueprint('comments', __name__)

def are_friends(user_id1, user_id2):
    return Friendship.query.filter(
        (
            (Friendship.user_id == user_id1) & (Friendship.friend_id == user_id2) |
            (Friendship.user_id == user_id2) & (Friendship.friend_id == user_id1)
        ) & (Friendship.status == 'accepted')
    ).count() > 0

@comment_routes.route('/<int:daily_log_id>/new-comment', methods=['POST'])
@login_required
def leave_comment(daily_log_id):
    """
    leave a new comment by current logged-in user
    """
    daily_log = DailyLog.query.get(daily_log_id)
    if not daily_log:
        return {'error': {'message': 'Daily log not found'}}, 404
    
    kid = Kid.query.get(daily_log.kid_id)
    if not kid:
        return {'error': {'message': 'kid not found'}}, 404
    
    if kid.user_id != current_user.id and not are_friends(current_user.id, kid.user_id):
        return {'error': {'message': 'You are not allowed to comment this daily log'}}, 403
    
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_comment = Comment(
            user_id=current_user.id,
            daily_log_id=daily_log.id,
            comment=form.data['comment'],
            created_at = datetime.utcnow()
        )
        db.session.add(new_comment)
        db.session.commit()
        return new_comment.to_dict(), 201
    else:
        return {'errors': form.errors}, 400

@comment_routes.route('/<int:comment_id>', methods=['GET', 'PUT'])
@login_required
def update_comment(comment_id):
    """
    Update a comment by log-in user
    """
    updated_comment = Comment.query.get(comment_id)
    if not updated_comment:
        return {'error': {'message': 'Comment not found'}}, 404
    
    if updated_comment.user_id != current_user.id:
        return {'error': {'message': 'You are not authorized to edit this comment'}}, 403
    
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        updated_comment.comment = form.data['comment']
        updated_comment.created_at = datetime.utcnow()
        db.session.commit()
        return updated_comment.to_dict(), 200
    elif form.errors:
        return {'errors': form.errors}, 400
    else:
        form.process(obj=updated_comment)
        return updated_comment.to_dict()

@comment_routes.route('/<int:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(comment_id):
    """
    Delete a comment by log-in user
    """
    comment = Comment.query.get(comment_id)
    if not comment:
        return {'error': {'message': 'Comment not found'}}, 404
    
    if comment.user_id != current_user.id:
        return {'error': {'message': 'You are not authorized to delete this comment'}}, 403
    
    db.session.delete(comment)
    db.session.commit()
    return {'message': 'Comment deleted successfully'}, 200

@comment_routes.route('/<int:daily_log_id>/comments')
@login_required
def get_comments(daily_log_id):
    """
    Get all comments for a specific daily log by log-in user
    """
    daily_log = DailyLog.query.get(daily_log_id)
    if not daily_log:
        return {'error': {'message': 'Daily log not found'}}, 404
    
    comments = Comment.query.filter_by(daily_log_id=daily_log_id).order_by(Comment.created_at.desc()).all()
    return [comment.to_dict() for comment in comments], 200