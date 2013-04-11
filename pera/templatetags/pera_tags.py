__author__ = 'thiago.rodrigues'

from django import template
from django.conf import settings
from pera import defaults
register = template.Library()


@register.filter('components_path')
def get_components_path(components_path, app_path=''):
    rtn = []
    current_path = app_path
    if current_path[:1] == '/':
        current_path = current_path[1:]

    if current_path[-1:] == '/':
        current_path = current_path[:-1]

    if len(current_path.split('/')) > 1:
        rtn = ['../' for n in current_path.split('/')]
    rtn.append(components_path, )

    return ''.join(rtn)

@register.inclusion_tag('pera/require_config.html', takes_context=True)
def require_with_config(context, *args, **kwargs):
    require_path = '%s%s' % (settings.STATIC_URL, (kwargs.get('require_path', None) or defaults.PERA_REQUIRE_BASE_URL))

    context.update({
        'main': kwargs.get('main', ''),
        'base_path': kwargs.get('base_path', ''),
        'components': get_components_path(kwargs.get('components', '') or defaults.PERA_COMPONENTS_PATH, kwargs.get('base_path', '')),
        'require_path': require_path,
    })
    return context
