__author__ = 'thiagorsouz'

from django import forms
from django.utils.translation import ugettext_lazy as _
from django.contrib import admin
from .models import Todo

admin.site.register(Todo)


def application_admin_fields(form, *args, **kwargs):
    return {
        'exclusive_subpages': forms.BooleanField(
            label=_('Only privates'),
            required=False,
            initial=form.instance.parameters.get('only_private', False),
            help_text=_('Display only private todos.'),
        ),
    }
