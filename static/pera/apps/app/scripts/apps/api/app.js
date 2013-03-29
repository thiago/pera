'use strict';

define([
	'common.app',
	"angular.resource",
	"angular.ui.directives.if",
	"angular.ui.directives.jq",
	"angular.ui.directives.select2"
], function ApiApp(app) {
	return app.define('api', ['ng','ui']);
});