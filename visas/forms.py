from django.contrib.auth.models import User
from django import forms
from django.forms import ModelForm

"""
User registration
"""
class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'password')

"""
Q & A 
"""
class FormForm(forms.Form):
    question = forms.CharField(widget=forms.TextInput(attrs={'readonly':'readonly'}),
                required=False)
    answer_text =  forms.CharField(required=False)
    answer_recording = forms.FileField(required=False)

