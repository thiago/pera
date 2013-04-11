__author__ = 'thiagorsouz'


from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('todomvc.views',
                       url(r'^$', 'todos', name='todo_list'),
                       )