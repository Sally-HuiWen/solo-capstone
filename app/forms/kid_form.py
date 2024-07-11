from flask_wtf import FlaskForm
from wtforms import StringField, DateField, SubmitField
from wtforms.validators import DataRequired, Length

class KidForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=50, message='Name can not be more than 50 characters')])
    birthday = DateField('Birthday', validators=[DataRequired()])
    relationship = StringField('Relationship', validators=[DataRequired(), Length(max=50, message='Name can not be more than 50 characters')])
    submit = SubmitField('submit')