from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import BooleanField, SubmitField
from wtforms.validators import DataRequired, Length, Optional
from app.api.AWS_helpers import ALLOWED_EXTENSIONS

class DailyLogImageForm(FlaskForm):
    image = FileField('Image File', validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    preview = BooleanField('Preview', validators=[Optional()])#can handle False values correctly by using the Optional validator for the BooleanField instead of DataRequired.
    submit = SubmitField('submit')