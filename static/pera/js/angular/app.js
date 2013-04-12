'use strict';

define(['angular'], function CommonApp(angular) {
	var app                 = {};
	app.define              = function define(name, dephs) {
		if(name) {
			var module            = angular.module(name, (dephs || []));
			module.config(['$interpolateProvider', function ($interpolate) {
			  $interpolate.startSymbol('((');
			  $interpolate.endSymbol('))');
			}]);
			app.__defineGetter__(name, function() {return module;});
			return angular.extend(app[name], {
				init: function init() {
					angular.bootstrap(document, [name]);
				}
			});
		} else {
			/* TODO: implement error on app define */
		}
	};

	return app;
});