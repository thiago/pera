from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from feincms.module.page.sitemap import PageSitemap
from autocomplete.views import autocomplete

sitemaps = {'pages': PageSitemap}
admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', 'pera.views.home', name='home'),
                       url(r'^admin_tools/', include('admin_tools.urls')),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^autocomplete/', include(autocomplete.urls)),
                       url(r'^todos/', include('todomvc.urls')),
                       url(r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap', {'sitemaps': sitemaps}),
                       url(r'', include('feincms.urls')),
                       ) + staticfiles_urlpatterns() + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
