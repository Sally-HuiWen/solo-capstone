from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import User, db
from app.forms import UserProfilePictureForm
from app.api.AWS_helpers import (upload_file_to_s3, get_unique_filename)

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

@user_routes.route('/upload-profile-picture', methods=['POST'])
@login_required
def upload_profile_image():
    """
    Upload a new profile image for the current logged-in user
    """
    form = UserProfilePictureForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print('what is upload in backend route upload', upload)

        if "url" not in upload:
            return {'errors': upload["errors"]}, 400

        url = upload["url"]

        # update the user's profile image url
        current_user.user_image_url = url
        db.session.commit()
        return {'user_image_url': url}, 201
    else:
        return {'errors': form.errors}, 400


@user_routes.route('/update-profile-picture', methods=['GET', 'PUT'])
@login_required
def update_profile_image():
    """
    Update user profile image by current logged-in user 
    """
    existing_image = current_user.user_image_url
    if existing_image is None:
        return {'errors': {'message': 'profile picture not found'}}, 404

    form = UserProfilePictureForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        if 'image' in form.data and form.data['image']:
            image = form.data['image']
            image.filename = get_unique_filename(image.filename)
            upload = upload_file_to_s3(image)
            print('what is upload in backend route update', upload)

            if 'url' not in upload:
                return {'errors': upload['errors']}, 400
            url = upload['url']
            current_user.user_image_url = url
        
        db.session.commit()
        return {'user_image_url': url}, 200
    elif form.errors:
        return {'errors': form.errors}, 400
    else:
        form.process(obj=existing_image)
        return existing_image
    
@user_routes.route('/delete-profile-picture', methods=['DELETE'])
@login_required
def delete_profile_image():
    """
    Delete the profile image by the current logged-in user
    """
    existing_image = current_user.user_image_url
    if existing_image is None:
        return {'errors': {'message': 'profile picture not found'}}, 404

    current_user.user_image_url = None
    db.session.commit()
    return {'message': 'Your profile picture is deleted successfully'}, 200
