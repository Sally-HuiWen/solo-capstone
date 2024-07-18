from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import DailyLog, Kid, db
from app.forms import DailyLogForm
from datetime import datetime
from app.api.AWS_helpers import (upload_file_to_s3, get_unique_filename)

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
        updated_daily_log.create_at = datetime.utcnow()

        if 'image' in form.data and form.data['image']:
            image = form.data['image']
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)
            print(upload)

            if 'url' not in upload:
                return {'errors': upload['errors']}, 400
            url = upload['url']
            updated_daily_log.image_url = url

        db.session.commit()
        return updated_daily_log.to_dict(), 200
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

