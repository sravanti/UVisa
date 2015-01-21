from django.conf.urls import patterns, url

from visas import views

urlpatterns = patterns('',
    url(r'^$', views.user_login, name='login'),
    url(r'^form/$', views.load_form, name='form'),
    url(r'^login/$', views.user_login, name='login'),
    url(r'^logout/$', views.user_logout, name='logout'),
    url(r'^submit/$', views.process_answer, name='process_answer'),
)
