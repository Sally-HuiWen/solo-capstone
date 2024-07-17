from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField
from app.api.AWS_helpers import ALLOWED_EXTENSIONS

class DailyLogImageForm(FlaskForm):
    image = FileField('Image File', validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    submit = SubmitField('submit')