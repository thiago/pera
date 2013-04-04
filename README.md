Projeto Pera
============

Pré-Requisitos
--------------

* pip
* node
* npm


Instalação
----------

    git clone git@github.com:trsouz/pera.git
    cd pera
    pip install -r requirements.txt
    npm run-script setup
    python manage.py syncdb
    python manage.py runserver

Novidades
=========

Perfil Profissional
-------------------

Enviar e customizar templates de emails diretamente no "Action" da listagem do admin Django.

* Altere o template padrão e depois customize o template do(s) usuários desejado.

Account
-------

**Template tags

get_info:

    {{ USER|get_info:['telefone[,order]'] }}

ou:

    {% with tel=USER|get_info:['telefone[,order]'] %}
        ...
    {% endwith %}

get_info_flat

    {{ USER|get_info_flat:['telefone[,order]'] }}

ou:

    {% with tel=USER|get_info_flat[:'telefone[,order]'] %}
        ...
    {% endwith %}

get_avatar

    # Padrão é 'square' mas você pode usar 'square', 'small', 'normal' ou 'large'
    # Você pode especificar mais opcões em "ACCOUNT_SIZES" no arquivo 'settings.py'.
    # {{ USER|get_avatar[:'square'] }}
