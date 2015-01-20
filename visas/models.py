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
    link = models.URLField(max_length=255, blank=True, null=True)

    def __unicode__(self):
        return self.question_eng

class Form(models.Model):
    #temporarily making all questions in the form by default
    questions = Question.objects.all()
    answers = []
    for i in enumerate(questions):
        answers.append(Answer())

    #question_set = models.ManyToManyField(Question)
    user = models.OneToOneField(User)
    
    def __unicode__(self):
        return self.user.username + " Last login: " + str(self.user.last_login)  

    def last_completed(self):
        print 'len answers: '  + str(len(self.answers))
        for i in range(len(self.answers)):
            if not (self.answers[i].answer_text and
               self.answers[i].transcription and
               self.answers[i].audio):
                    print 'answer:' + str(i)
                    return i+1
        return len(self.answers)
