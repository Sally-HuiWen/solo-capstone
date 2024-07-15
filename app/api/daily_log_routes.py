from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import DailyLog, DailyLogImage, Kid, db
from app.forms import DailyLogForm, DailyLogImageForm
from datetime import datetime

daily_log_routes = Blueprint('daily_logs', __name__)

@daily_log_routes.route('/<int:daily_log_id>')
@login_required
def get_daily_log_by_id(daily_log_id):
    """
    Get one daily_log details for a daily_log_id by current logged-in user 
    """
    daily_log = DailyLog.query.get(daily_log_id)
    if daily_log is None:
        return {'errors': {'message': 'Daily_log not found'}}, 404
    
    kid = Kid.query.get(daily_log.kid_id)
    if (kid.user_id != current_user.id):
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    return daily_log.to_dict(), 200


@daily_log_routes.route('/<int:daily_log_id>', methods=['GET', 'PUT'])
@login_required
def update_daily_log(daily_log_id):
    """
    Update one daily_log details by current logged-in user 
    """
    updated_daily_log = DailyLog.query.get(daily_log_id)
    if updated_daily_log is None:
        return {'errors': {'message': 'daily_log not found'}}, 404
    kid = Kid.query.get(updated_daily_log.kid_id)
    if (kid.user_id != current_user.id):
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    form = DailyLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        updated_daily_log.title = form.data['title']
        updated_daily_log.content = form.data['content']
        updated_daily_log.created_at = datetime.utcnow()
        db.session.commit()
        return updated_daily_log.to_dict()
    elif form.errors:
        return {'errors': form.errors}, 400
    else:
        form.process(obj=updated_daily_log)
        return updated_daily_log.to_dict()

@daily_log_routes.route('/<int:daily_log_id>', methods=['DELETE'])
@login_required
def delete_daily_log(daily_log_id):
    """
    Delete one daily_log by current logged-in user 
    """
    daily_log = DailyLog.query.get(daily_log_id)
    if daily_log is None:
        return {'errors': {'message': 'daily_log not found'}}, 404
    kid = Kid.query.get(daily_log.kid_id)
    if (kid.user_id != current_user.id):
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    db.session.delete(daily_log)
    db.session.commit()
    return {'message': 'This daily_log is deleted successfully'}, 200

#Read-- get all daily log images by daily_log_id
@daily_log_routes.route('/<int:daily_log_id>/images')
@login_required
def get_all_images_by_daily_log_id(daily_log_id):
    """
    Get all images for a specific daily_log by current logged-in user
    """
    daily_log = DailyLog.query.get(daily_log_id)
    if daily_log is None:
        return {'errors': {'message': 'Daily log not found'}}, 404

    kid = Kid.query.get(daily_log.kid_id)
    if kid.user_id != current_user.id:
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    images = DailyLogImage.query.filter_by(daily_log_id=daily_log_id).all()
    return {"images": [image.to_dict() for image in images]}, 200

#Create-- create new image for one specific daily log
@daily_log_routes.route('/<int:daily_log_id>/images/new', methods = ['POST'])
@login_required
def upload_new_image(daily_log_id):
    """
    upload a new image for a specific daily_log by current logged-in user 
    """
    daily_log = DailyLog.query.get(daily_log_id)
    if daily_log is None:
        return {'errors': {'message': 'daily_log not found'}}, 404
    kid = Kid.query.get(daily_log.kid_id)
    if (kid.user_id != current_user.id):
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    form = DailyLogImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_image = DailyLogImage(
            daily_log_id = daily_log_id,
            url = form.data['url'],
            preview = form.data['preview']
        )
        db.session.add(new_image)
        db.session.commit()
        return new_image.to_dict(), 201
    else:
        return {'errors': form.errors}, 400
