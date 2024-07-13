from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Length, Optional

class DailyLogImageForm(FlaskForm):
    url = StringField('Url', validators=[DataRequired(), Length(max=2000, message='Url can not be more than 2000 characters')])
    preview = BooleanField('Preview', validators=[Optional()])#can handle False values correctly by using the Optional validator for the BooleanField instead of DataRequired.
    submit = SubmitField('submit')