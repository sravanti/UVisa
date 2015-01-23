from django.conf.urls import patterns, url
from django.conf import settings
from django.conf.urls.static import static
from visas import views

urlpatterns = patterns('',
    url(r'^$', views.user_login, name='login'),
    url(r'^form/$', views.load_form, name='form'),
    url(r'^login/$', views.user_login, name='login'),
    url(r'^logout/$', views.user_logout, name='logout'),
    url(r'^submit/$', views.process_answer, name='process_answer'),
    url(r'^lookup/$', views.load_lookup, name='load_lookup'),
    url(r'^lookup/lookupuser/$', views.lookup, name='lookup'),
    url(r'^recorderWorker.js/$', views.serve_js, name='serve_js'),
    #url(r'^upload/$', views.upload, name='upload'), 
)
