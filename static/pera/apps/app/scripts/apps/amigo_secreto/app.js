'use strict';

define([
	'common.app',
	'apps/amigo_secreto/services/djangoLocal',
	'angular.module.localStorage',
	'angular.ui.common'
], function SecretSantaApp(app) {
	return app.define('SecretSanta', ['ng', 'ui', 'djangoLocal', 'ngResource']);
});