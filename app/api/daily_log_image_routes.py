from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import DailyLog, Kid, DailyLogImage, db
from app.forms import DailyLogImageForm

daily_log_image_routes = Blueprint('daily_log_images', __name__)

@daily_log_image_routes.route('/<int:daily_log_image_id>', methods=['GET', 'PUT'])
@login_required
def update_daily_log_image(daily_log_image_id):
    """
    Update one image by current logged-in user 
    """
    updated_image = DailyLogImage.query.get(daily_log_image_id)
    if updated_image is None:
        return {'errors': {'message': 'This daily log image not found'}}, 404
    
    daily_log = DailyLog.query.get(updated_image.daily_log_id)
    kid = Kid.query.get(daily_log.kid_id)
    if (kid.user_id != current_user.id):
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    form = DailyLogImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        updated_image.url = form.data['url']
        updated_image.preview = form.data['preview']
        db.session.commit()
        return updated_image.to_dict()
    elif form.errors:
        return {'errors': form.errors}, 400
    else:
        form.process(obj=updated_image)
        return updated_image.to_dict()
    

    
@daily_log_image_routes.route('/<int:daily_log_image_id>', methods=['DELETE'])
@login_required
def delete_daily_log_image(daily_log_image_id):
    """
    Delete one image by current logged-in user 
    """
    image = DailyLogImage.query.get(daily_log_image_id)
    if image is None:
        return {'errors': {'message': 'image not found'}}, 404
    
    daily_log = DailyLog.query.get(image.daily_log_id)
    kid = Kid.query.get(daily_log.kid_id)
    if (kid.user_id != current_user.id):
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    db.session.delete(image)
    db.session.commit()
    return {'message': 'This daily log image is deleted successfully'}, 200