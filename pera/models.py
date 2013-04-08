# -- conding: utf-8 --

from django.utils.translation import ugettext_lazy as _

from feincms.module.page.models import Page
from feincms.content.richtext.models import RichTextContent
from feincms.content.medialibrary.v2 import MediaFileContent
from django.http import HttpResponseForbidden


def get_attr_super_page(page, attr, default=None):
    current = page
    while current:
        if getattr(current, attr):
            return getattr(current, attr)
        current = current.parent
    return default


def authenticated_request_processor(page, request):
    page.private = get_attr_super_page(page, 'private', False)
    if not request.user.is_authenticated() and page.private:
        return HttpResponseForbidden()


Page.register_request_processor(authenticated_request_processor)
Page.register_extensions('datepublisher', 'changedate', 'seo', 'pera.extensions.permission')
Page.register_templates({
    'title': _('Standard template'),
    'path': 'base.html',
    'regions': (
        ('main', _('Main content area')),
        ('sidebar', _('Sidebar'), 'inherited'),
    ),
})

Page.create_content_type(RichTextContent)
Page.create_content_type(MediaFileContent, TYPE_CHOICES=(
    ('default', _('default')),
    ('lightbox', _('lightbox')),
))