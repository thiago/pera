# -- conding: utf-8 --

from django.utils.translation import ugettext_lazy as _

from feincms.module.page.models import Page
from feincms.content.richtext.models import RichTextContent
from feincms.content.medialibrary.v2 import MediaFileContent
from feincms.content.application.models import ApplicationContent

from account.extensions.permission import authenticated_request_processor
from todomvc.admin import application_admin_fields as todo_application_admin_fields
from todomvc.models import TodoContent


Page.register_request_processor(authenticated_request_processor)
Page.register_extensions('datepublisher', 'changedate', 'seo', 'account.extensions.permission')
Page.register_templates({
    'title': _('Standard template'),
    'path': 'pera/feincms_templates/default.html',
    'regions': (
        ('main', _('Main content area')),
        ('sidebar', _('Sidebar'), 'inherited'),
    ),
})

Page.create_content_type(TodoContent, TYPE_CHOICES=(
    ('backbone', _('Backbone')),
))
Page.create_content_type(RichTextContent)
Page.create_content_type(MediaFileContent, TYPE_CHOICES=(
    ('default', _('default')),
    ('lightbox', _('lightbox')),
))

Page.create_content_type(ApplicationContent, APPLICATIONS=(
    ('todos', _('Todo application'), {
        'urls': 'todomvc.urls',
        'admin_fields': todo_application_admin_fields,
        }),
))