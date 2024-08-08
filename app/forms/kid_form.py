from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, DateField, SubmitField
from wtforms.validators import DataRequired, Length, Optional
from app.api.AWS_helpers import ALLOWED_EXTENSIONS

class KidForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=50, message='Name can not be more than 50 characters')])
    birth_date = DateField('birth_date', validators=[DataRequired()])
    relationship = StringField('Relationship', validators=[DataRequired()])
    image = FileField('Image File', validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])# Optional() make it to be able to have 'None'value! not updating image is ok!
    submit = SubmitField('submit')