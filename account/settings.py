from django.conf import settings

ACCOUNT_ANONYMOUS_NAME = getattr(
    settings,
    'ACCOUNT_ANONYMOUS_NAME',
    'Visitante')
ACCOUNT_DEFAULT_IMG_PROFILE = getattr(
    settings,
    'ACCOUNT_DEFAULT_IMG_PROFILE',
    'defaults/account/user.jpg')
ACCOUNT_SIZES = getattr(settings, 'ACCOUNT_SIZES', {
    'square'					: (50, 50),
    'small'						: (50, 0),
    'normal'					: (100, 0),
    'large'						: (200, 0),
})
ACCOUNT_SIZE_DEFAULT = getattr(settings, 'ACCOUNT_SIZE_DEFAULT', 'square')
