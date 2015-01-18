from visas.models import *
from django.db.models import Count
from django.contrib.auth.models import User
from django import forms
from django.forms import ModelForm
from django.contrib import admin

"""
User registration
"""
class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'password')
"""
class FormForm(forms.Form):
    questions = Question.objects.all()
    answers = []
    for i in range(len(questions)):
         answers.append(forms.CharField())


class FormAdmin(admin.ModelAdmin):
    class Meta:
        model = Form
        fields = ('question_set', 'answer_set')
"""
