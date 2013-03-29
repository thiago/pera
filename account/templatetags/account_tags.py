__author__ = 'thiago.rodrigues'

from django import template
register = template.Library()


def base_get_info(user, attr, flat=False):
	data        = attr.split(',')

	if len(data) == 1:
		return user.profile.get_info(key=attr, flat=flat)

	elif len(data) > 1:
		return user.profile.get_info(key=data[0], order=data[1], flat=flat)
	else:
		return user.profile.get_info(flat=flat)

@register.filter('get_info')
def get_info(user, attr=''):
	# USAGE: {{ USER|get_info:"telefone[,order]" }}
	# {% with tel=USER|get_info:"telefone[,order]" %}
	#	...
	# {% endwith %}
	return base_get_info(user, attr)

@register.filter('get_info_flat')
def get_info_flat(user, attr=''):
	# USAGE: {{ USER|get_info_flat:"telefone[,order]" }}
	# {% with tel=USER|get_info_flat:"telefone[,order]" %}
	#	...
	# {% endwith %}
	return base_get_info(user, attr, flat=True)

@register.filter('get_avatar')
def get_avatar(user, size=None):
	# USAGE: {{ USER|get_avatar:"square" }}
	# Default is 'square' but you can use 'square', 'small', 'normal' or 'large'
	# You can set must values with variable "ACCOUNT_SIZES" in settings file.
	return user.profile.get_avatar(size)