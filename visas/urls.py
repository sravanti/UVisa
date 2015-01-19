from django.conf.urls import patterns, url

from visas import views

urlpatterns = patterns('',
    url(r'^$', views.user_login, name='login'),
    url(r'^form/$', views.load_form, name='form'),
    url(r'^login/$', views.user_login, name='login'),
)
