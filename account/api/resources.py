# -- coding: utf-8 --

import json
from django.db import models
from django.contrib.auth.models import User, AnonymousUser
from django.contrib.auth import authenticate, login
from django.conf.urls import url
from django.core import urlresolvers
from django.http import HttpResponseRedirect

from tastypie import fields
from tastypie.authorization import Authorization, ReadOnlyAuthorization, DjangoAuthorization
from tastypie.authentication import Authentication, BasicAuthentication, SessionAuthentication
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie.utils import trailing_slash
from tastypie.models import create_api_key

models.signals.post_save.connect(create_api_key, sender=User)


class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        excludes = ['email', 'password', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login']
        list_allowed_methods = ['post', "path"]
        detail_allowed_methods = ['get', 'post', 'put', 'delete', 'patch']
        ordering = ['id', 'username']
        authorization = Authorization()
        include_resource_uri = True
        filtering = {
            'id': ALL,
            'username': ALL,
        }

    def get_avatar(self, user=None, type=None):
        if user:
            return user.profile.get_avatar(type)
        return AnonymousUser.profile.get_avatar(type)

    def get_avatar_response(self, request, **kwargs):
        pk = request.GET.get('pk', None) or kwargs.get('pk', None)
        try:
            user = User.objects.get(pk=pk)
        except:
            user = None

        if user:
            image = self.get_avatar(user=user, type=request.GET.get('type', None))
        else:
            image = self.get_avatar(type=request.GET.get('type', None))
        return HttpResponseRedirect(image)

    # TODO: logout view
    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/picture/$" % (self._meta.resource_name), self.wrap_view('get_avatar_response'),
                name="api_anonymous_user_get_avatar"),
            url(r"^(?P<resource_name>%s)/(?P<pk>\w[\w/-]*)/picture%s$" % (self._meta.resource_name, trailing_slash()),
                self.wrap_view('get_avatar_response'), name="api_user_get_avatar"),
            url(r"^(?P<resource_name>%s)/signin%s$" % (self._meta.resource_name, trailing_slash()),
                self.wrap_view('signin'), name="api_signin"),
        ]

    def signin(self, request, **kwargs):
        user = None
        if request.method == 'POST' and not (request.user and request.user.is_authenticated()):
            try:
                self.method_check(request, allowed=['post'])
                if (request.POST.get('username', None) and request.POST.get('password', None)):
                    username = request.POST.get('username', None)
                    password = request.POST.get('password', None)
                else:
                    data = json.loads(request.raw_post_data)
                    username = data['username']
                    password = data['password']
                user = authenticate(username=username, password=password)
                if user:
                    if user.is_active:
                        login(request, user)
            except:
                pass

        if (request.user and request.user.is_authenticated()) or (user and user.is_active):
            bundle = self.build_bundle(obj=request.user, request=request)
            bundle = self.full_dehydrate(bundle)
            bundle = self.alter_detail_data_to_serialize(request, bundle)
            return self.create_response(request, bundle)
        else:
            return self.create_response(request, {'success': False})

    def dehydrate(self, bundle):
        bundle = super(UserResource, self).dehydrate(bundle)
        bundle.data['name'] = bundle.obj.profile.get_full_name
        bundle.data['avatar'] = urlresolvers.reverse('api_user_get_avatar',
                                                     kwargs={'resource_name': self._meta.resource_name,
                                                             'api_name': self._meta.api_name, 'pk': bundle.data['id']})
        return bundle