__author__ = 'trsouz'

from django.shortcuts import render
from todomvc.models import Todo


def todos(request, template='todomvc/type/default.html'):
    return render(request, template, )


def todos_application(request):
    return 'todomvc/todos.html', {'object_list': Todo.objects.all()}
