from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Kid, DailyLog, db
from app.forms import KidForm, DailyLogForm
from datetime import datetime

kid_routes = Blueprint('kids', __name__)

@kid_routes.route('/current')
@login_required
def get_user_kids():
    """
    Get all kids by current logged-in user
    """
    user_kids = Kid.query.filter_by(user_id=current_user.id).all()
    return {"kids": [kid.to_dict() for kid in user_kids]}

@kid_routes.route('/<int:kid_id>')
@login_required
def get_kid_by_id(kid_id):
    """
    Get s specific kid by id by current logged-in user
    """
    kid = Kid.query.get(kid_id)
    if kid is None:
        return {'errors': {'message': 'Kid not found'}}, 404
    
    if kid.user_id != current_user.id:
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    return kid.to_dict()

@kid_routes.route('/new', methods = ['POST'])
@login_required
def add_new_kid():
    """
    Add a new kid by current logged-in user
    """
    form = KidForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_kid = Kid(
            user_id = current_user.id,
            name = form.data['name'],
            birth_date= form.data['birth_date'],
            relationship = form.data['relationship']
        )
        db.session.add(new_kid)
        db.session.commit()
        return new_kid.to_dict(), 201
    else:
        return {'errors': form.errors}, 400

@kid_routes.route('/<int:kid_id>', methods=['GET', 'PUT'])
@login_required
def update_kid(kid_id):
    """
    Update a kid by Id by current logged-in user
    """
    updated_kid = Kid.query.get(kid_id)
    if updated_kid is None:
        return {'errors': {'message': 'Kid not found'}}, 404
    if updated_kid.user_id != current_user.id:
        return {'errors': {'message': 'You are not authorized'}}, 403

    form = KidForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        updated_kid.name = form.data['name']
        updated_kid.birth_date = form.data['birth_date']
        updated_kid.relationship = form.data['relationship']
        db.session.commit()
        return updated_kid.to_dict()
    elif form.errors:
        return {'errors': form.errors}, 400
    else:
        form.process(obj=updated_kid)# pre-populates the form fields with the data from updated_kid.The obj parameter means the Kid object (updated_kid) whose data is used to populate the form fields. 
        return updated_kid.to_dict()

@kid_routes.route('/<int:kid_id>', methods=['DELETE'])
@login_required
def remove_kid(kid_id):
    """
    Remove a kid by current logged-in user 
    """
    kid = Kid.query.get(kid_id)
    if kid is None:
        return {'errors': {'message': 'Kid not found'}}, 404
    if kid.user_id != current_user.id:
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    db.session.delete(kid)
    db.session.commit()
    return {'message': 'kid remove successfully'}, 200

#READ--get all_daily_logs of a specific kid
@kid_routes.route('/<int:kid_id>/daily_logs')
@login_required
def get_all_daily_logs_by_kid_id(kid_id):
    """
    Get all daily logs for a specific kid by current logged-in user 
    """
    kid = Kid.query.get(kid_id)
    if kid is None:
        return {'errors': {'message': 'Kid not found'}}, 404
    if kid.user_id != current_user.id:
        return {'errors': {'message': 'You are not authorized'}}, 403
    #Do not forget to sort it!
    all_daily_logs = DailyLog.query.filter_by(kid_id=kid_id).order_by(DailyLog.created_at.desc()).all()
    return {'daily_logs': [log.to_dict() for log in all_daily_logs]}

#Create--post a new daily_log of a specific kid
@kid_routes.route('/<int:kid_id>/daily_logs/new', methods = ['POST'])
@login_required
def create_new_daily_log(kid_id):
    """
    Create a new daily log for a specific kid by current logged-in user 
    """
    kid = Kid.query.get(kid_id)
    if kid is None:
        return {'errors': {'message': 'Kid not found'}}, 404
    if kid.user_id != current_user.id:
        return {'errors': {'message': 'You are not authorized'}}, 403
    
    form = DailyLogForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_daily_log = DailyLog(
            kid_id=kid_id,
            content=form.data['content'],
            created_at=datetime.utcnow()#set created_at here instead of in forms
        )
        db.session.add(new_daily_log)
        db.session.commit()
        return new_daily_log.to_dict(), 201
    else:
        return {'errors': form.errors}, 400
