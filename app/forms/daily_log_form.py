from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length

class DailyLogForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=50, message='Title can not be more than 50 characters')])
    content = StringField('Content', validators=[DataRequired(), Length(max=2000, message='Content can not be more than 2000 characters')])
    submit = SubmitField('submit')

#created_at could be put here, import DateTimeField. But in practice,it is better to set it in the models 
# or in route handler rather than in the form