from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from autocomplete.views import autocomplete
from feincms.module.page.sitemap import PageSitemap
from tastypie.api import Api

from account.api.resources import UserResource
from todomvc.api.resources import TodoResource

sitemaps = {'pages': PageSitemap}
admin.autodiscover()
v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(TodoResource())

urlpatterns = patterns('',
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^admin_tools/', include('admin_tools.urls')),
                       url(r'^api/', include(v1_api.urls)),
                       url(r'^autocomplete/', include(autocomplete.urls)),
                       url(r'^todomvc/', include('todomvc.urls'), name='todos'),
                       url(r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap', {'sitemaps': sitemaps}),
                       url(r'', include('feincms.urls')),
                       ) + staticfiles_urlpatterns() + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
