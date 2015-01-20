from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import RequestContext
from django.contrib.auth import authenticate, login
from visas.forms import *
from visas.models import *
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect

"""
Register / login / logout
"""
def index(request):
    return render(request,'visas/index.html')

def register(request):
    registered = False
    if request.method == 'POST':
        user_form = UserForm(data=request.POST)
        if user_form.is_valid():
            user = user_form.save()
            user.set_password(user.password)
            user.save()
            registered = True
            form = Form.objects.get_or_create(user=user)
        else: 
            print user_form.errors
    else:
        user_form = UserForm()

def user_login(request):
   if request.method == 'POST':
        username = request.POST['username']
        print 'username: ' + username
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            """
            form = Form.objects.get(user=user)
            question_num = form.last_completed()
            print 'question num: ' + str(question_num)
            return (request, 'visas/form.html')
            """
            return HttpResponseRedirect(reverse('form'))
        else:
            # need to create a new account
            register(request)
            question_num = 1
            print str(Question.objects.get(id=question_num))
            return render(request, 'visas/form.html', 
                        {'question_num': Question.objects.get(id=question_num)})
   else: 
        return render(request,'visas/index.html')


def user_logout(request):
    logout(request)
    return redirect('/')

"""
Form submission
"""
def load_form(request):
    user = request.user
    form = Form.objects.get(user=user)
    question_num = str(form.last_completed())
    print 'question_num: ' + question_num
    question = Question.objects.get(id=question_num)
    print 'question text: ' + question.question_eng
    form = FormForm(initial={'question': question.question_eng})
    return render(request, 'visas/form.html', 
                {'form': form,})
                #'question_num': question_num})

def get_next_question(request, num):
    return Question.objects.get(id=num+1)

def process_answer(request):
    if request.method == 'POST':
        user = request.user
        form = Form.objects.get(user=user)
        form_data = FormForm(request.POST)
        answer_text = form_data.cleaned_data['answer_text']
        question_num = form_data.question_num
        form.answers[question_num-1].answer_text = answer_text
        print answers[question_num-1].answer_text
    
 
