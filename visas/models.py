from django.db import models
from django.contrib.auth.models import User

NUM_QUESTIONS = 50

class Answer(models.Model):
    answer_text = models.TextField(blank=True, null=True)
    transcription = models.TextField(blank=True, null=True)
    audio = models.FileField(upload_to="audio/%Y/%m/%d", blank=True, null=True)

    def __unicode__(self):
        return self.answer_text

class Question(models.Model):
    question_eng = models.CharField(max_length=255, blank=True, null=True)
    question_esp = models.CharField(max_length=255, blank=True, null=True)
    link = models.URLField(max_length=255, blank=True, null=True)

    def __unicode__(self):
        return self.question_eng

class Form(models.Model):
    answers = []
    for i in range(NUM_QUESTIONS):
        answers.append(Answer(answer_text=""))

    #question_set = models.ManyToManyField(Question)
    user = models.OneToOneField(User)
    
    def __unicode__(self):
        return self.user.username + " Last login: " + str(self.user.last_login)  

    def last_completed(self):
        print 'len answers: '  + str(len(self.answers))
        num = 1
        for i in range(len(self.answers)-1, 0, -1):
            """ 
            below for when transcription/audio comes in
            if not (self.answers[i].answer_text and
               self.answers[i].transcription and
               self.answers[i].audio):
                    print 'first unanswered:' + str(i)
                    return i+1
            """
            try:
                print 'self.answers['+str(i)+']: ' + self.answers[int(i)].answer_text
                if self.answers[i].answer_text != "":
                    print 'first unanswered: ' + str(i+1)
                    num = i+1
                if self.answers[i].audio is not None:
                    print 'audio file for question ' + str(i)
                else:
                    print 'no audio file'
            except Exception as inst:
                print inst
        return num
