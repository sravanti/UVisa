from django.conf.urls import patterns, url

from visas import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^form/$', views.load_form, name='form')
)
