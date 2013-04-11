__author__ = 'trsouz'

from django.conf import settings

PERA_COMPONENTS_PATH = getattr(settings, 'PERA_COMPONENTS_PATH', 'components/')
PERA_REQUIRE_BASE_URL = getattr(settings, 'PERA_REQUIRE_BASE_URL', 'components/requirejs/require.js')