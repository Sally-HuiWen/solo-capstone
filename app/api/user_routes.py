from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import User

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/friends')
@login_required
def get_user_friends():
    """
    Get friends of the current logged-in user
    """
    friends = current_user.get_friends()
    return friends, 200

@user_routes.route('/search-username')
def search_username():
    username = request.args.get('username') #retrieve the value of a query parameter from the request URL
    if not username:
        return {'errors': {'message': 'No username provided'}}, 400
    
    user = User.query.filter(User.username.ilike(username)).first()
    
    if user:
        return {'user_exist': user.to_dict()}, 200
    return {'message': 'This user does not exist'}, 200


@user_routes.route('/search-email')
def search_email():
    email = request.args.get('email')
    if not email:
        return {'errors': {'message': 'No email provided'}}, 400

    user = User.query.filter_by(email=email).first()
    if user:
        return {'email_exist': user.to_dict()}, 200
    return {'message': 'This user does not exist'}, 200