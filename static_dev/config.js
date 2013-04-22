// Project requirejs configuration file
//
// For more options and documentation visit:
// https://github.com/jrburke/r.js/blob/master/build/example.build.js
(function () {
	var root = this;
	var defaultsPaths = {
		static: '/static/',//path static
		base: '', //path app relative static path;
		components: 'components/' //path components relative static path;
	};

	root.requireCreateConfig = function (options) {

		var currentOptions = defaultsPaths;
		switch(typeof options){
			case 'string':
				currentOptions.base = options;
				break;
			case 'object':
				if(options.static) currentOptions.static = options.static;
				if(options.base) currentOptions.base = options.base;
				if(options.components) currentOptions.components = options.components;
				break;
		}
		var get_components_path = (function(opt){
			return currentOptions.components + (currentOptions.components.charAt(currentOptions.components.length - 1) != '/' ? '/' : '');
		})(options);

		return {
			baseUrl: currentOptions.static + currentOptions.base,
			locale: 'pt-br',
			paths: {
				// Pera
				'pera': currentOptions.static + 'pera',
				'pera.angular.app': currentOptions.static + 'pera/js/angular/app',

				// Components
				components: get_components_path,
				root: currentOptions.static,
				// RequireJS
				require: get_components_path + 'requirejs/require',
				i18n: get_components_path + 'requirejs-i18n/i18n',
				text: get_components_path + 'requirejs-text/text',
				domReady: get_components_path + 'requirejs-domready/domReady',

				// Plugins
				moment: get_components_path + 'moment/min/lang/pt-br',
				'moment.i18n': get_components_path + 'moment/min/lang',

				select2: get_components_path + 'select2/select2_locale_pt-BR',
				underscore: get_components_path + 'underscore/underscore',
				backbone: get_components_path + 'backbone/backbone',
				'backbone.localstorage': get_components_path + 'backbone.localStorage/backbone.localStorage',

				// jQuery
				jquery: get_components_path + 'jquery/jquery',
				carouFredSel: get_components_path + 'carouFredSel-5.6.1/jquery.carouFredSel-5.6.1-packed',
				'jquery.maskedinput': get_components_path + 'plugins/jquery.maskedinput',
				'jquery.fancybox': get_components_path + 'fancybox/source/jquery.fancybox.pack',
				'jquery.ui': get_components_path + 'jquery-ui/ui/minified/i18n/jquery.ui.datepicker-pt-BR.min',

				/* TODO:
				 resolver problema para o idioma do jquery.ui
				 */
				'jquery.ui.i18n': get_components_path + 'jquery-ui/ui/minified/i18n/',
				'jquery.ui.accordion': get_components_path + 'jquery-ui/ui/minified/jquery.ui.accordion.min',
				'jquery.ui.autocomplete': get_components_path + 'jquery-ui/ui/minified/jquery.ui.autocomplete.min',
				'jquery.ui.button': get_components_path + 'jquery-ui/ui/minified/jquery.ui.button.min',
				'jquery.ui.core': get_components_path + 'jquery-ui/ui/minified/jquery.ui.core.min',
				'jquery.ui.datepicker': get_components_path + 'jquery-ui/ui/minified/i18n/jquery.ui.datepicker-pt-BR.min',
				'jquery.ui.dialog': get_components_path + 'jquery-ui/ui/minified/jquery.ui.dialog.min',
				'jquery.ui.draggable': get_components_path + 'jquery-ui/ui/minified/jquery.ui.draggable.min',
				'jquery.ui.droppable': get_components_path + 'jquery-ui/ui/minified/jquery.ui.droppable.min',
				'jquery.ui.effect': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect.min',
				'jquery.ui.effect.blind': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-blind.min',
				'jquery.ui.effect.bounce': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-bounce.min',
				'jquery.ui.effect.clip': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-clip.min',
				'jquery.ui.effect.drop': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-drop.min',
				'jquery.ui.effect.explode': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-explode.min',
				'jquery.ui.effect.fade': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-fade.min',
				'jquery.ui.effect.fold': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-fold.min',
				'jquery.ui.effect.highlight': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-highlight.min',
				'jquery.ui.effect.pulsate': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-pulsate.min',
				'jquery.ui.effect.scale': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-scale.min',
				'jquery.ui.effect.shake': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-shake.min',
				'jquery.ui.effect.slide': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-slide.min',
				'jquery.ui.effect.transfer': get_components_path + 'jquery-ui/ui/minified/jquery.ui.effect-transfer.min',
				'jquery.ui.menu': get_components_path + 'jquery-ui/ui/minified/jquery.ui.menu.min',
				'jquery.ui.mouse': get_components_path + 'jquery-ui/ui/minified/jquery.ui.mouse.min',
				'jquery.ui.position': get_components_path + 'jquery-ui/ui/minified/jquery.ui.position.min',
				'jquery.ui.progressbar': get_components_path + 'jquery-ui/ui/minified/jquery.ui.progressbar.min',
				'jquery.ui.resizable': get_components_path + 'jquery-ui/ui/minified/jquery.ui.resizable.min',
				'jquery.ui.selectable': get_components_path + 'jquery-ui/ui/minified/jquery.ui.selectable.min',
				'jquery.ui.slider': get_components_path + 'jquery-ui/ui/minified/jquery.ui.slider.min',
				'jquery.ui.sortable': get_components_path + 'jquery-ui/ui/minified/jquery.ui.sortable.min',
				'jquery.ui.spinner': get_components_path + 'jquery-ui/ui/minified/jquery.ui.spinner.min',
				'jquery.ui.tabs': get_components_path + 'jquery-ui/ui/minified/jquery.ui.tabs.min',
				'jquery.ui.tooltip': get_components_path + 'jquery-ui/ui/minified/jquery.ui.tooltip.min',
				'jquery.ui.widget': get_components_path + 'jquery-ui/ui/minified/jquery.ui.widget.min',

				// AngularJS
				angular: get_components_path + 'angular/angular.min',
				'angular.pera': 'root/pera/js/resource',
				'angular.cookies': get_components_path + 'angular-cookies/angular-cookies',
				'angular.mocks': get_components_path + 'angular-mocks/angular-mocks',
				'angular.resource': get_components_path + 'angular-resource/angular-resource',
				'angular.sanitize': get_components_path + 'angular-sanitize/angular-sanitize',
				'angular.module.localStorage': get_components_path + 'plugins/angular.module.localStorage',
				'angular.ui': get_components_path + 'angular-ui/build/angular-ui',
				'angular.ui.common': get_components_path + 'angular-ui/common/module',
				'angular.ui.directives.animate': get_components_path + 'angular-ui/modules/directives/animate/animate',
				'angular.ui.directives.calendar': get_components_path + 'angular-ui/modules/directives/calendar/calendar',
				'angular.ui.directives.codemirror': get_components_path + 'angular-ui/modules/directives/codemirror/codemirror',
				'angular.ui.directives.currency': get_components_path + 'angular-ui/modules/directives/currency/currency',
				'angular.ui.directives.date': get_components_path + 'angular-ui/modules/directives/date/date',
				'angular.ui.directives.event': get_components_path + 'angular-ui/modules/directives/event/event',
				'angular.ui.directives.if': get_components_path + 'angular-ui/modules/directives/if/if',
				'angular.ui.directives.jq': get_components_path + 'angular-ui/modules/directives/jq/jq',
				'angular.ui.directives.keypress': get_components_path + 'angular-ui/modules/directives/keypress/keypress',
				'angular.ui.directives.map': get_components_path + 'angular-ui/modules/directives/map/map',
				'angular.ui.directives.mask': get_components_path + 'angular-ui/modules/directives/mask/mask',
				'angular.ui.directives.reset': get_components_path + 'angular-ui/modules/directives/reset/reset',
				'angular.ui.directives.route': get_components_path + 'angular-ui/modules/directives/route/route',
				'angular.ui.directives.scrollfix': get_components_path + 'angular-ui/modules/directives/scrollfix/scrollfix',
				'angular.ui.directives.select2': get_components_path + 'angular-ui/modules/directives/select2/select2',
				'angular.ui.directives.showhide': get_components_path + 'angular-ui/modules/directives/showhide/showhide',
				'angular.ui.directives.sortable': get_components_path + 'angular-ui/modules/directives/sortable/sortable',
				'angular.ui.directives.tinymce': get_components_path + 'angular-ui/modules/directives/tinymce/tinymce',
				'angular.ui.directives.validate': get_components_path + 'angular-ui/modules/directives/validate/validate',
				'angular.ui.filters.format': get_components_path + 'angular-ui/modules/filters/format/format',
				'angular.ui.filters.highlight': get_components_path + 'angular-ui/modules/filters/highlight/highlight',
				'angular.ui.filters.inflector': get_components_path + 'angular-ui/modules/filters/inflector/inflector',
				'angular.ui.filters.unique': get_components_path + 'angular-ui/modules/filters/unique/unique',

				// Bootstrap JS
				bootstrap: get_components_path + 'bootstrap/js/bootstrap',
				'bootstrap.affix': get_components_path + 'bootstrap/js/bootstrap-affix',
				'bootstrap.alert': get_components_path + 'bootstrap/js/bootstrap-alert',
				'bootstrap.button': get_components_path + 'bootstrap/js/bootstrap-button',
				'bootstrap.carousel': get_components_path + 'bootstrap/js/bootstrap-carousel',
				'bootstrap.collapse': get_components_path + 'bootstrap/js/bootstrap-collapse',
				'bootstrap.dropdown': get_components_path + 'bootstrap/js/bootstrap-dropdown',
				'bootstrap.modal': get_components_path + 'bootstrap/js/bootstrap-modal',
				'bootstrap.popover': get_components_path + 'bootstrap/js/bootstrap-popover',
				'bootstrap.scrollspy': get_components_path + 'bootstrap/js/bootstrap-scrollspy',
				'bootstrap.tab': get_components_path + 'bootstrap/js/bootstrap-tab',
				'bootstrap.tooltip': get_components_path + 'bootstrap/js/bootstrap-tooltip',
				'bootstrap.transition': get_components_path + 'bootstrap/js/bootstrap-transition',
				'bootstrap.typeahead': get_components_path + 'bootstrap/js/bootstrap-typeahead'
			},

			shim: {
				underscore: {
					exports: '_'
				},
				jquery: {
					exports: 'jQuery'
				},
				backbone: {
					deps: ['underscore', 'jquery'],
					exports: 'Backbone'
				},
				'backbone.localstorage': {
					deps: ['backbone']
				},
				lodash: {
					exports: '_'
				},
				angular: {
					exports: 'angular'
				},
				'angular.pera': {
					deps: ['angular'],
					exports: 'pera'
				},
				moment: {
					deps: ['components/moment/min/moment.min'],
					exports: 'moment'
				},
				i18n: ['require'],
				carouFredSel: ['jquery'],
				'components/select2/select2': ['jquery'],
				select2: ['jquery', 'components/select2/select2'],

				'angular.cookies': ['angular'],
				'angular.mocks': ['angular'],
				'angular.resource': ['angular'],
				'angular.sanitize': ['angular'],

				'angular.module.localStorage': ['angular'],
				'angular.ui': ['angular', 'jquery.ui'],
				'angular.ui.common': ['angular'],

				'angular.ui.directives.animate': ['angular', 'angular.ui.common'],
				'angular.ui.directives.calendar': ['angular', 'angular.ui.common'],
				'angular.ui.directives.codemirror': ['angular', 'angular.ui.common', 'plugins/codemirror'],
				'angular.ui.directives.currency': ['angular', 'angular.ui.common'],
				'angular.ui.directives.date': ['angular', 'angular.ui.common', 'jquery.ui.datepicker'],
				'angular.ui.directives.event': ['angular', 'angular.ui.common'],
				'angular.ui.directives.if': ['angular', 'angular.ui.common'],
				'angular.ui.directives.jq': ['angular', 'angular.ui.common'],
				'angular.ui.directives.keypress': ['angular', 'angular.ui.common'],
				'angular.ui.directives.map': ['angular', 'angular.ui.common'],
				'angular.ui.directives.mask': ['angular', 'angular.ui.common', 'jquery.maskedinput'],
				'angular.ui.directives.reset': ['angular', 'angular.ui.common'],
				'angular.ui.directives.route': ['angular', 'angular.ui.common'],
				'angular.ui.directives.scrollfix': ['angular', 'angular.ui.common'],
				'angular.ui.directives.select2': ['angular', 'angular.ui.common', 'select2'],
				'angular.ui.directives.showhide': ['angular', 'angular.ui.common'],
				'angular.ui.directives.sortable': ['angular', 'angular.ui.common'],
				'angular.ui.directives.tinymce': ['angular', 'angular.ui.common'],
				'angular.ui.directives.validate': ['angular', 'angular.ui.common'],
				'angular.ui.filters.format': ['angular', 'angular.ui.common'],
				'angular.ui.filters.highlight': ['angular', 'angular.ui.common'],
				'angular.ui.filters.inflector': ['angular', 'angular.ui.common'],
				'angular.ui.filters.unique': ['angular', 'angular.ui.common'],

				'jquery.fancybox': ['jquery'],
				'jquery.maskedinput': ['jquery'],
				'components/jquery-ui/ui/minified/jquery-ui.custom.min': ['jquery'],
				'components/jquery-ui/ui/minified/jquery.ui.datepicker.min': ['jquery', 'jquery.ui.core'],
				'jquery.ui': ['components/jquery-ui/ui/minified/jquery-ui.custom.min'],
				'jquery.ui.core': ['jquery'],
				'jquery.ui.accordion': ['jquery', 'jquery.ui.core'],
				'jquery.ui.autocomplete': ['jquery', 'jquery.ui.core'],
				'jquery.ui.button': ['jquery', 'jquery.ui.core'],
				'jquery.ui.datepicker': ['jquery', 'components/jquery-ui/ui/minified/jquery.ui.datepicker.min'],
				'jquery.ui.dialog': ['jquery', 'jquery.ui.core'],
				'jquery.ui.draggable': ['jquery', 'jquery.ui.core'],
				'jquery.ui.droppable': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.blind': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.bounce': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.clip': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.drop': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.explode': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.fade': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.fold': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.highlight': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.pulsate': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.scale': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.shake': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.slide': ['jquery', 'jquery.ui.core'],
				'jquery.ui.effect.transfer': ['jquery', 'jquery.ui.core'],
				'jquery.ui.menu': ['jquery', 'jquery.ui.core'],
				'jquery.ui.mouse': ['jquery', 'jquery.ui.core'],
				'jquery.ui.position': ['jquery', 'jquery.ui.core'],
				'jquery.ui.progressbar': ['jquery', 'jquery.ui.core'],
				'jquery.ui.resizable': ['jquery', 'jquery.ui.core'],
				'jquery.ui.selectable': ['jquery', 'jquery.ui.core'],
				'jquery.ui.slider': ['jquery', 'jquery.ui.core'],
				'jquery.ui.sortable': ['jquery', 'jquery.ui.core'],
				'jquery.ui.spinner': ['jquery', 'jquery.ui.core'],
				'jquery.ui.tabs': ['jquery', 'jquery.ui.core'],
				'jquery.ui.tooltip': ['jquery', 'jquery.ui.core'],
				'jquery.ui.widget': ['jquery', 'jquery.ui.core'],

				'bootstrap.affix': ['jquery'],
				'bootstrap.alert': ['jquery'],
				'bootstrap.button': ['jquery'],
				'bootstrap.carousel': ['jquery'],
				'bootstrap.collapse': ['jquery'],
				'bootstrap.dropdown': ['jquery'],
				'bootstrap.modal': ['jquery'],
				'bootstrap.popover': ['jquery', 'bootstrap.tooltip'],
				'bootstrap.scrollspy': ['jquery'],
				'bootstrap.tab': ['jquery'],
				'bootstrap.tooltip': ['jquery'],
				'bootstrap.transition': ['jquery'],
				'bootstrap.typeahead': ['jquery']
			}
		}
	};

	if (typeof exports === 'object') {
		module.exports = root.requireCreateConfig;
	} else if (typeof define === 'function' && define.amd) {
		requirejs.config(root.requireCreateConfig());
	}else{
		root.require = root.requireCreateConfig();
	}
}).call(this);
