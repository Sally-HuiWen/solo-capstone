from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import SubmitField
from wtforms.validators import Optional
from app.api.AWS_helpers import ALLOWED_EXTENSIONS

class UserProfilePictureForm(FlaskForm):
     image = FileField('Image File', validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])# Optional() make it to be able to have 'None'value! not updating image is ok!
     submit = SubmitField('submit')