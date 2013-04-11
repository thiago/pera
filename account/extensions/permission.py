# -- coding: utf-8 --
__author__ = 'thiagorodrigues'
from django.db import models
from django.http import HttpResponseForbidden
from django.utils.translation import ugettext_lazy as _
from feincms.admin import tree_editor


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


def register(cls, admin_cls):
    cls.add_to_class('private', models.BooleanField(
        verbose_name=_('Privado'),
        default=False,
        help_text=_('Check this option to only logged in users accessing this page and its ancestors')
    ))
    admin_cls.fieldsets[0][1]['fields'] += ['private', ]
    admin_cls.list_display.insert(2, 'is_private_admin')

    def is_private_admin(self, page):
        if not hasattr(self, "_private_pages"):
            self._private_pages = list()

        if page.parent_id and page.parent_id in self._private_pages:
            if page.id in self._private_pages:
                self._private_pages.remove(page.id)
            return tree_editor.ajax_editable_boolean_cell(page, 'private', override=True, text=_('inherited'))

        if page.private and not page.id in self._private_pages:
            return tree_editor.ajax_editable_boolean_cell(page, 'private', override=True, text=_('extensions'))

        return tree_editor.ajax_editable_boolean_cell(page, 'private')

    def is_private_recursive(self, page):
        retval = []
        for c in page.get_descendants(include_self=True):
            retval.append(self.is_private_admin(c))
        return retval

    def _refresh_changelist_caches(self, *args, **kwargs):
        self._visible_pages = list(
            self.model.objects.active().values_list('id', flat=True))
        self._private_pages = list(self.model.objects.filter(
            private=True).values_list('id', flat=True))

    is_private_admin = is_private_admin
    is_private_admin.allow_tags = True
    is_private_admin.short_description = _('is private')
    is_private_admin.editable_boolean_field = 'private'
    is_private_admin.editable_boolean_result = is_private_recursive
    admin_cls.is_private_admin = is_private_admin
    admin_cls._refresh_changelist_caches = _refresh_changelist_caches
