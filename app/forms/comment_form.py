from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length

class CommentForm(FlaskForm):
    comment = StringField('Comment', validators=[DataRequired(), Length(max=255, message='Name can not be more than 255 characters')])
    submit = SubmitField('submit')

#created_at could be put here, import DateTimeField. But in practice,it is better to set it in the models 
# or in route handler rather than in the form