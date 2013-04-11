# -- coding: utf-8 --

from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS

from account.api.resources import UserResource
from todomvc.models import Todo


class TodoResource(ModelResource):
    owner = fields.ForeignKey(UserResource, attribute='owner')

    class Meta:
        queryset = Todo.objects.all()
        resource_name = 'todo'
        list_allowed_methods = ['get', 'post', 'put', 'path', 'delete']
        detail_allowed_methods = ['get', 'post', 'put', 'delete', 'patch']
        ordering = ['id', 'completed', 'private', 'date_created', 'date_latest_edited', 'value', 'owner']
        authorization = Authorization()
        include_resource_uri = False
        filtering = {
            'id': ALL,
            'completed': ALL,
            'private': ALL,
            'date_created': ALL,
            'date_latest_edited': ALL,
            'value': ALL,
            'owner': ALL_WITH_RELATIONS
        }