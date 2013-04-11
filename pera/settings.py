import os

PROJECT_PATH = os.path.realpath(os.path.dirname(__file__))
DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'project.db',
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}

INTERNAL_IPS = ('127.0.0.1',)
TIME_ZONE = 'America/Sao_Paulo'
LANGUAGE_CODE = 'pt-BR'

SITE_ID = 1

USE_I18N = True
USE_L10N = True
USE_TZ = True

MEDIA_ROOT = 'media'
MEDIA_URL = '/media/'

STATIC_URL = '/static/'
STATICFILES_DIRS = (("./static/", "static"))
ADMIN_MEDIA_PREFIX = STATIC_URL + 'admin/'
AUTOCOMPLETE_MEDIA_PREFIX = STATIC_URL + 'autocomplete/media/'

COMPRESS_PRECOMPILERS = (
    ('text/less', 'lessc --no-color {infile} {outfile}'),
)

COMPRESS_ROOT = ('static')
COMPRESS_OUTPUT_DIR = 'compiled/'

COMPRESS_CSS_FILTERS = [
    'compressor.filters.css_default.CssAbsoluteFilter',
    'compressor.filters.cssmin.CSSMinFilter',
]

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
    #'django.contrib.staticfiles.finders.DefaultStorageFinder',
)
STATICFILES_STORAGE = 'require.storage.OptimizedStaticFilesStorage'

SECRET_KEY = 'gu0)hl7a-bs$y&amp;gi@ewi6p-*81=2kow^vu@+kk@q-$n5(4(ei)'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
    # 'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.request',
    'django.core.context_processors.static',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    #'debug_toolbar.middleware.DebugToolbarMiddleware',
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'pera.urls'

WSGI_APPLICATION = 'pera.wsgi.application'

TEMPLATE_DIRS = ('templates')

INSTALLED_APPS = (
    'admin_tools',
    'admin_tools.theming',
    'admin_tools.menu',
    'admin_tools.dashboard',

    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.sitemaps',

    'autocomplete',
    'compressor',
    'debug_toolbar',
    'mptt',
    'sorl.thumbnail',
    'require',

    'feincms',
    'feincms.module.page',
    'feincms.module.medialibrary',

    'account',
    'pera',
    'todomvc',
)

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_PORT = 587

###########
# FEINCMS #
###########

#FEINCMS_REVERSE_MONKEY_PATCH = False
#FEINCMS_JQUERY_NO_CONFLICT = False
#FEINCMS_TREE_EDITOR_INCLUDE_ANCESTORS = True
#FEINCMS_FRONTEND_EDITING = True
FEINCMS_MEDIALIBRARY_UPLOAD_TO = 'medialibrary/%Y/%m/'
FEINCMS_RICHTEXT_INIT_CONTEXT = {
    'TINYMCE_JS_URL': STATIC_URL + 'components/tinymce/jscripts/tiny_mce/tiny_mce.js',
    'TINYMCE_CONTENT_CSS_URL': None,
    'TINYMCE_LINK_LIST_URL': None,
    'TINYMCE_BUTTONS_1': ['save', 'newdocument', 'bold', 'italic', 'underline', 'strikethrough', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'styleselect', 'formatselect', 'fontselect', 'fontsizeselect'],
    'TINYMCE_BUTTONS_2': ['cut', 'copy', 'paste', 'pastetext', 'pasteword', 'search', 'replace', 'bullist', 'numlist', 'outdent', 'indent', 'blockquote', 'undo', 'redo', 'link', 'unlink', 'anchor', 'image', 'cleanup', 'help', 'code', 'insertdate', 'inserttime', 'preview', 'forecolor', 'backcolor'],
    'TINYMCE_BUTTONS_3': ['tablecontrols', 'hr', 'removeformat', 'visualaid', 'sub', 'sup', 'charmap', 'emotions', 'iespell', 'media', 'advhr', 'print', 'ltr', 'rtl', 'fullscreen'],
    'TINYMCE_BUTTONS_4': ['insertlayer', 'moveforward', 'movebackward', 'absolute', 'styleprops', 'cite', 'abbr', 'acronym', 'del', 'ins', 'attribs', 'visualchars', 'nonbreaking', 'template', 'pagebreak'],
    'TINYMCE_PLUGINS': ['autolink', 'lists', 'pagebreak', 'style', 'layer', 'table', 'advhr', 'advimage', 'advlink', 'emotions', 'iespell', 'inlinepopups', 'insertdatetime', 'preview', 'media', 'searchreplace', 'contextmenu', 'directionality', 'fullscreen', 'noneditable', 'visualchars', 'nonbreaking', 'xhtmlxtras', 'advlist'],
    'TINYMCE_BLOCK_FORMATS': ['h2', 'h3', 'h4', 'h5', 'h6', 'p'],
}

###############
# ADMIN_TOOLS #
###############
ADMIN_TOOLS_MENU = 'pera.admin_menu.CustomMenu'
ADMIN_TOOLS_INDEX_DASHBOARD = 'pera.admin_dashboard.CustomIndexDashboard'
ADMIN_TOOLS_APP_INDEX_DASHBOARD = 'pera.admin_dashboard.CustomAppIndexDashboard'
#ADMIN_TOOLS_THEMING_CSS = 'css/theming.css'

#############
# DEBUG BAR #
#############
DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': False,
    #'SHOW_TOOLBAR_CALLBACK': custom_show_toolbar,
    #'EXTRA_SIGNALS': ['myproject.signals.MySignal'],
    'HIDE_DJANGO_SQL': False,
    'TAG': 'body',
    'ENABLE_STACKTRACES': True,
}

########
# PERA #
########
PERA_COMPONENTS_PATH = 'components/'
PERA_REQUIRE_BASE_URL = 'components/requirejs/require.js'

###########
# REQUIRE #
###########
#REQUIRE_BASE_URL = 'components/requirejs/require.js'
REQUIRE_BASE_URL = ''
REQUIRE_BUILD_PROFILE = 'app.build.js'
REQUIRE_JS = 'components/requirejs/require.js'
REQUIRE_STANDALONE_MODULES = {
    'main': {
        'out': 'main.built.js'
    }
}
REQUIRE_ENVIRONMENT = 'auto'

###########
# LOGGING #
###########
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

try:
    from pera.local_settings import *
except ImportError:
    pass
