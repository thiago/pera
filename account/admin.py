# -- coding: utf-8 --
from django.contrib import admin
from django.contrib.admin import site
from sorl.thumbnail.admin import AdminImageMixin
from .models import *


class UserInfoInline(admin.TabularInline):
    model = UserInfo
    extra = 2


class UserProfileAdmin(AdminImageMixin, admin.ModelAdmin):
    inlines = [
        UserInfoInline,
    ]


class UserInfoAttrAdmin(admin.ModelAdmin):
    prepopulated_fields = {"key": ("label",)}

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(UserInfoAttr, UserInfoAttrAdmin)


from django.contrib.admin import helpers
from django.contrib.contenttypes.models import ContentType
from django.contrib.sites.models import Site
from django.core import mail
from django.http import HttpResponse
from django.template.base import Template, RequestContext
from django.views.generic.base import TemplateResponse
from django.utils import simplejson

import copy
import json


from autocomplete.views import autocomplete, AutocompleteSettings
from autocomplete.admin import AutocompleteAdmin


class UserAutocomplete(AutocompleteSettings):
    search_fields = ('^username', '^email')

class DepartamentAutocomplete(AutocompleteSettings):
    search_fields = ('^name', '^slug', '^description')

class RoleAutocomplete(AutocompleteSettings):
    search_fields = ('^name', '^slug', '^description')

autocomplete.register(ProfessionalProfile.user, UserAutocomplete)
autocomplete.register(ProfessionalProfile.department, DepartamentAutocomplete)
autocomplete.register(ProfessionalProfile.role, RoleAutocomplete)

DEFAULT_EMAIL = {}
DEFAULT_EMAIL['subject'] = 'Pera - {{ site.name }}'
DEFAULT_EMAIL['from_email'] = 'Pera@example.com'
DEFAULT_EMAIL['message'] = """Olá {{ obj.user.username }}, <br />
Este é o template padrão de email enviado via pera app Django.
"""


class NoteInline(admin.TabularInline):
    model = Note
    extra = 1


class ProfessionalProfileAdmin(AutocompleteAdmin, admin.ModelAdmin):
    list_display = ['id', 'user_profile', 'department', 'role']
    list_display_links = ['id']
    ordering = ['user', 'department', 'role']
    search_fields = [
        'user__username',
        'user__first_name',
        'user__last_name',
        'department__name',
        'role__name']
    list_filter = ['user', 'department', 'role']
    actions = ['admin_send_email']
    inlines = [NoteInline, ]

    class Media:
        css = {
            "all": ("pera/admin/css/style.css",)
        }

    def changelist_view(self, request, extra_context=None):
        def parsePost():
            try:
                json_data = simplejson.loads(request.raw_post_data)
                return json_data
            except:
                return None

        if request.method == 'POST' and parsePost():
            data = parsePost()
            if data['action'] == 'admin_send_email' and data['_selected_action']:
                queryset = self.model.objects.filter(
                    pk__in=data['_selected_action'])
                return self.admin_send_email(request, queryset, data)

        return super(ProfessionalProfileAdmin, self).changelist_view(request, extra_context=extra_context)

    def admin_send_email(self, request, queryset, data=None):
        context = RequestContext(request, {
            'action_name': 'admin_send_email',
            'action_checkbox_name': helpers.ACTION_CHECKBOX_NAME,
            'title': "Enviar Email",
            'default': DEFAULT_EMAIL,
            'queryset': queryset,
            'opts': self.model._meta,
            'content_type_id':
                ContentType.objects.get_for_model(self.model).id,
            'site': Site.objects.get_current()
        })
        if data:
            messages = []
            connection = mail.get_connection()
            for obj in queryset:
                email_list = obj.user.profile.get_info('email', flat=True)
                if email_list:
                    if 'custom' in data and str(obj.pk) in data['custom'] and data['custom'][str(obj.pk)].keys():
                        current = data['custom'][str(obj.pk)]
                        subject = current['subject']
                        from_email = current['from_email']
                        to = current['to']
                        message = current['message']
                    else:
                        subject = DEFAULT_EMAIL['subject']
                        from_email = DEFAULT_EMAIL['from_email']
                        to = [email_list[0], ]
                        message = DEFAULT_EMAIL['message']

                    current_context = copy.copy(context)
                    current_context.update({
                        'obj': self.model
                    })
                    subject = Template(
                        subject).render(current_context)
                    from_email = Template(
                        from_email).render(
                        current_context)
                    message = Template(
                        message).render(current_context)
                    current_mail = mail.EmailMessage(
                        subject, message, from_email, to)
                    current_mail.content_subtype = 'html'
                    messages.append(current_mail)

            response_data = {}
            try:
                connection.open()
                connection.send_messages(messages)
                connection.close()
                response_data['status'] = 'success'
            except:
                response_data['status'] = 'error'
                response_data[
                    'message'] = 'Ocorreu um erro durante o envio dos emails'

            return HttpResponse(json.dumps(response_data), mimetype="application/json")

        return TemplateResponse(request, 'admin/account/professionalprofile/send_email.html', context, current_app=self.admin_site.name)
    admin_send_email.short_description = "Enviar Email(s)"


class DepartamentAdmin(AutocompleteAdmin, admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


class RoleAdmin(AutocompleteAdmin, admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(ProfessionalProfile, ProfessionalProfileAdmin)
admin.site.register(Department, DepartamentAdmin)
admin.site.register(Role, RoleAdmin)
