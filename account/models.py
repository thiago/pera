# -- coding: utf-8 --
from django.conf import settings
from django.contrib.auth.models import User, AnonymousUser
from django.contrib.sites.models import Site
from django.db import models
from django.db.models.signals import post_save
from django.template.loader import render_to_string

from sorl.thumbnail import ImageField, get_thumbnail

from .settings import ACCOUNT_DEFAULT_IMG_PROFILE, ACCOUNT_SIZES, ACCOUNT_SIZE_DEFAULT, ACCOUNT_ANONYMOUS_NAME


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    sites = models.ManyToManyField(Site)
    picture = ImageField(upload_to='account/profile', null=True, blank=True)
    biography = models.TextField(null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    def get_avatar(self, type=None):
        image_url = ACCOUNT_DEFAULT_IMG_PROFILE if not self.picture else self.picture.file.name

        if type in ACCOUNT_SIZES:
            size = ACCOUNT_SIZES[type]
        else:
            size = ACCOUNT_SIZES[
                ACCOUNT_SIZE_DEFAULT] if ACCOUNT_SIZE_DEFAULT in ACCOUNT_SIZES else ACCOUNT_SIZES[
                    list(
                        ACCOUNT_SIZES)[
                            0]]
        size_string = '%d' % size[0] if size[0] > 0 else ''
        size_string += 'x%d' % size[1] if size[1] > 0 else ''
        try:
            image = get_thumbnail(image_url, size_string, crop='center').url
        except IOError:
            image = settings.MEDIA_URL + image_url

        return image

    @property
    def avatar(self):
        return self.get_avatar()

    @property
    def get_full_name(self):
        if self.user.is_anonymous():
            return ACCOUNT_ANONYMOUS_NAME
        return (u'%s %s' % (self.user.first_name, self.user.last_name)) if self.user.first_name else self.user.username

    def get_info(self, key=None, order='order', flat=False):
        rtn = []
        if (not key or key == 'email') and self.user.email:
            if not flat:
                primary_email = {}
                primary_email['label'] = 'Email'
                primary_email['value'] = self.user.email
                rtn.append(primary_email)
            else:
                rtn.append(self.user.email)

        data = self.information.all() if not key else self.information.filter(
            label__key=key)
        data = data.order_by(order)
        if flat:
            data = data.values_list('value', flat=True)
        rtn.extend(data)
        return rtn

    def admin_display_related(self):
        return render_to_string("admin/account/profile_display_related.html", {
            'profile': self,
            'opts': self._meta
        })

    admin_display_related.short_description = "Usuário"
    admin_display_related.allow_tags = True

    def __unicode__(self):
        return self.user.__unicode__()

    def __str__(self):
        return self.get_full_name

    class Meta:
        ordering = ['id']
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfis'


class UserInfoAttr(models.Model):
    label = models.CharField(max_length=60)
    key = models.SlugField(max_length=60)

    def __unicode__(self):
        return self.label

    def __str__(self):
        return self.label

    class Meta:
        ordering = ['label', 'key', 'id']
        verbose_name = 'Atributo'
        verbose_name_plural = 'Atributos'


class UserInfo(models.Model):
    order = models.IntegerField(default=0)
    label = models.ForeignKey(UserInfoAttr, related_name='information')
    value = models.CharField(max_length=255)
    user = models.ForeignKey(UserProfile, related_name='information')

    def __unicode__(self):
        return self.label.__unicode__() + ': ' + self.value

    def __str__(self):
        return self.label.__str__() + ': ' + self.value

    class Meta:
        ordering = ['label', 'id']
        verbose_name = 'Informação'
        verbose_name_plural = 'Informações'


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        user = UserProfile.objects.get_or_create(user=instance)[0]
        try:
            user.sites.add(Site.objects.get_current())
            user.save()
        except:
            pass

post_save.connect(create_user_profile, sender=User)
User.profile = property(
    lambda u: UserProfile.objects.get_or_create(
        user=u)[
            0])

AnonymousUser.username = ACCOUNT_ANONYMOUS_NAME
AnonymousUser.get_full_name = ACCOUNT_ANONYMOUS_NAME
AnonymousUser.profile = UserProfile()

class Department(models.Model):
    name = models.CharField(max_length=60)
    slug = models.SlugField(max_length=60)
    description = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']
        verbose_name = 'Departamento'
        verbose_name_plural = 'Departamentos'


class Role(models.Model):
    name = models.CharField(max_length=60)
    slug = models.SlugField(max_length=60)
    description = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']
        verbose_name = 'Cargo'
        verbose_name_plural = 'Cargos'


class ProfessionalProfile(models.Model):
    user = models.OneToOneField(User)
    department = models.ForeignKey(Department)
    role = models.ForeignKey(Role)

    def user_profile(self):
        return self.user.profile.admin_display_related()

    user_profile.short_description = "Usuário"
    user_profile.allow_tags = True

    def __unicode__(self):
        return self.user.__unicode__()

    def __str__(self):
        return self.user.__str__()

    class Meta:
        ordering = ['id']
        verbose_name = 'Perfil Profissional'
        verbose_name_plural = 'Perfis Profissionais'


class Note(models.Model):
    profie = models.ForeignKey(
        ProfessionalProfile,
        related_name='notes')
    text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_last_edited = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.text

    def __str__(self):
        return self.text

    class Meta:
        ordering = ['id']
        verbose_name = 'Nota'
        verbose_name_plural = 'Notas'


def get_professional_profile(user):
    rtn = None
    try:
        rtn = ProfessionalProfile.objects.get(user=user)
    except ProfessionalProfile.DoesNotExist:
        pass
    return rtn

User.professional_profile = property(lambda u: get_professional_profile(u))