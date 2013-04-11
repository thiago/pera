__author__ = 'thiagorsouz'

from django.shortcuts import render
from todomvc.models import Todo


def todos(request):
    return render(request, 'todomvc/types/angular.html', )


def todos_application(request):
    return 'todomvc/todos.html', {'object_list': Todo.objects.all()}
