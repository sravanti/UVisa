from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext
from django.contrib.auth import authenticate, login
from visas.forms import *
from visas.models import *

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
            form = Form.objects.get(user=user)
            question_num = form.last_completed()
            print 'question num: ' + str(question_num)
            return render(request, 'visas/form.html', 
                    {'question_num': question_num})
        else:
            # need to create a new account
            register(request)
            question_num = 0
            return render(request, 'visas/form.html', 
                        {'question_num': question_num})
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
    if request.method == 'POST':
        form = FormForm(request.POST)
        if form.is_valid():
           return redirect('/')
    else:
        form = Form.objects.get(user=user)
        question_num = form.is_complete
    return render(request, 'visas/form.html', 
                {'questions': form.questions,
                'answers': form.answers,
                'question_num': first_unanswered})

def get_next_question(request, num):
    pass



 
