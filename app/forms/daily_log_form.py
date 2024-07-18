from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length
from app.api.AWS_helpers import ALLOWED_EXTENSIONS

class DailyLogForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=50, message='Title can not be more than 50 characters')])
    content = StringField('Content', validators=[DataRequired(), Length(max=2000, message='Content can not be more than 2000 characters')])
    image = FileField('Image File', validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    submit = SubmitField('submit')

#created_at could be put here, import DateTimeField. But in practice,it is better to set it in the models 
# or in route handler rather than in the form