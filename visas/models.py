from django.db import models
from django.contrib.auth.models import User

class Answer(models.Model):
    answer_text = models.TextField(blank=True, null=True)
    transcription = models.TextField(blank=True, null=True)
    audio = models.FileField(blank=True, null=True)

    def __unicode__(self):
        return self.answer_text

class Question(models.Model):
    question_eng = models.CharField(max_length=255, blank=True, null=True)
    question_esp = models.CharField(max_length=255, blank=True, null=True)
    #link = models.CharField(blank=True, null=True)
 
    def __unicode__(self):
        return self.question_eng

class Form(models.Model):
    #temporarily making all questions in the form by default
    questions = Question.objects.all()
    answers = []
    for i in range(len(questions)):
        answers.append(Answer())

    #question_set = models.ManyToManyField(Question)
    user = models.OneToOneField(User)
    
    def __unicode__(self):
        return self.user.username + " Last login: " + str(self.user.last_login)  

    def is_complete(self):
        for answer in answers:
            if (len(answer.answer_text) == 0 and
                len(transcription) == 0 and
                audio is None):
                    return answer
        return True
