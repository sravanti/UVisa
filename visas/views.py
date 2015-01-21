from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import RequestContext
from django.contrib.auth import authenticate, login, logout
from visas.forms import *
from visas.models import *
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User

"""
Register / login / logout
"""
def index(request):
    return render(request,'visas/index.html')

def register(username, password):
    user = User.objects.create_user(username, password)
    print 'new user created'
    form = Form.objects.get_or_create(user=user)

@csrf_exempt
def user_login(request):
   if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                form = Form.objects.get(user=user)
                question_num = form.last_completed()
                print 'question_num_returned: ' + str(question_num)
        else:
            user = User.objects.create_user(username, '', password)
            print 'new user created ' + str(user.username)
            form = Form.objects.get_or_create(user=user)
            question_num = 1
        if request.is_ajax():
            return HttpResponse(question_num, content_type="text/plain")
   else: 
        return render(request,'visas/index.html')


def user_logout(request):
    logout(request)
    return redirect('/visas')

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

@require_http_methods(['POST'])
@csrf_exempt
def process_answer(request):
    print 'processing answer'
    username = request.POST['username']
    form = Form.objects.get(user=User.objects.get(username=username))
    print 'form: ' + form
    """
    form.answers[0].answer_text = request.POST['text']
    print 'answer text: ' + answers[0].answer_text
    """
    form.save()
    if request.is_ajax():
        return HttpResponse("")
    return reverse('visas.views.load_form')
    
 
