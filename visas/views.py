from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import RequestContext
from django.contrib.auth import authenticate, login
from visas.forms import *
from visas.models import *
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

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

@csrf_exempt
def user_login(request):
   if request.method == 'POST':
        print 'logging in'
        username = request.POST['username']
        print 'username: ' + username
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            print 'is user'
            login(request, user)
            if request.is_ajax():
                return HttpResponse("")
            return HttpResponseRedirect(reverse('form'))
        else:
            # need to create a new account
            register(request)
            question_num = 1
            print str(Question.objects.get(id=question_num))
            if request.is_ajax():
                return HttpResponse("")
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

@require_http_methods(['POST'])
@csrf_exempt
def process_answer(request):
    form = Form.objects.get(user=request.user)
    #change the below to correspond with AJAX request   
    """
    form_data = FormForm(request.POST)
    answer_text = form_data.cleaned_data['answer_text']
    question_num = form_data.question_num
    form.answers[question_num-1].answer_text = answer_text
    print answers[question_num-1].answer_text
    """
    form.save()
    if request.is_ajax():
        return HttpResponse("")
    return reverse('visas.views.load_form')
    
 
