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

Pera
----

###Template tags

**require_with_config**

    {% require_with_config main='main' [base_path='todomvc/backbone_require/js/' components='components/' require='components/requirejs/require.js'] %}
    {% comment %}
        retorna a configuração para o requirejs com o mapeamento dos arquivos baseado no base_path
    {% endcomment %}

**components_path**

    {% components_path [components='components/' base_path='todomvc/backbone_require/js/'] %}
    {# retorna ../../../components/ #}




Account
-------

###Template tags

**get_info**

    {{ USER|get_info:['telefone[,order]'] }}

**ou**

    {% with tel=USER|get_info:['telefone[,order]'] %}
        ...
    {% endwith %}

**get_info_flat**

    {{ USER|get_info_flat:['telefone[,order]'] }}

**ou**

    {% with tel=USER|get_info_flat[:'telefone[,order]'] %}
        ...
    {% endwith %}

**get_avatar**

    # Padrão é 'square' mas você pode usar 'square', 'small', 'normal' ou 'large'
    # Você pode especificar mais opcões em "ACCOUNT_SIZES" no arquivo 'settings.py'.
    # {{ USER|get_avatar[:'square'] }}
