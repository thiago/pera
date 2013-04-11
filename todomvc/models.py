# -- coding: utf-8 --

import warnings
from django import forms
from django.conf import settings
from django.contrib.admin.widgets import AdminRadioSelect
from django.contrib.auth.models import User
from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist
from django.db import models
from django.template.loader import render_to_string
from django.utils.translation import ugettext_lazy as _

from feincms.admin.item_editor import ItemEditorForm


class Todo(models.Model):
    completed = models.BooleanField(default=False, verbose_name=_('completed'))
    private = models.BooleanField(default=False, verbose_name=_('private'))
    date_created = models.DateTimeField(auto_now_add=True, verbose_name=_('date created'))
    date_latest_edited = models.DateTimeField(auto_now=True, verbose_name=_('date latest edited'))
    value = models.TextField(max_length=200, verbose_name=_('value'))
    owner = models.ForeignKey(User, verbose_name=_('owner'), blank=True, null=True)

    class Meta:
        ordering = ['-id']

    def __unicode__(self):
        return self.value


class TodoContent(models.Model):


    feincms_item_editor_includes = {
        #'head': ['admin/content/mediafile/init.html'],
    }

    class Meta:
        abstract = True
        verbose_name = _('todo')
        verbose_name_plural = _('todos')

    @classmethod
    def initialize_type(cls, TYPE_CHOICES, TODO_CLASS=Todo):
        if 'todomvc' not in settings.INSTALLED_APPS:
            raise ImproperlyConfigured, _('You have to add \'todomvc\' to your INSTALLED_APPS before creating a %s' % cls.__name__)

        if TYPE_CHOICES is None:
            raise ImproperlyConfigured, _('You need to set TYPE_CHOICES when creating a %s' % cls.__name__)

        cls.add_to_class('type', models.CharField(_('type'),
                                                  max_length=10, choices=TYPE_CHOICES,
                                                  default=TYPE_CHOICES[0][0]))

        cls.add_to_class('todos', models.ManyToManyField(TODO_CLASS,
                                                         verbose_name=_('todos'),
                                                         related_name='%s_%s_set' % (cls._meta.app_label, cls._meta.module_name),
                                                         blank=True,
                                                         null=True))

        class TodoContentAdminForm(ItemEditorForm):
            type = forms.ChoiceField(choices=TYPE_CHOICES,
                                             initial=TYPE_CHOICES[0][0], label=_('type'),
                                             widget=AdminRadioSelect(attrs={'class': 'radiolist'}))

        cls.feincms_item_editor_form = TodoContentAdminForm

    def render(self, **kwargs):
        return render_to_string([
                                    'todomvc/types/%s.html' % self.type,
                                    'todomvc/types/default.html',
                                    ], {'content': self}, context_instance=kwargs.get('context'))
