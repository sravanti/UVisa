from django.db import models

class Question(models.Model):
    question_text_eng = models.CharField(max_length=400)
    question_text_esp = models.CharField(max_length=400)
    answer = models.CharField(max_length=1000000)
    
