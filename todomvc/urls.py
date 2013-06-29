__author__ = 'trsouz'


from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('todomvc.views',
                       url(r'^$', 'todos', {'template': 'todomvc/type/backbone.html'}, name='home'),
                       url(r'^angular', 'todos', {'template': 'todomvc/type/angular.html'}, name='angular')
                       )