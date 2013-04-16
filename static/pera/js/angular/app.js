'use strict';

define(['angular', 'i18n!pera/js/nls/app'], function (angular, app_text) {
	var app = {};
	app.define = function (name, dephs) {
		if (name) {
			var application = angular.module(name, (dephs || []));

			application.config(['$interpolateProvider', function ($interpolate) {
				$interpolate.startSymbol('((');
				$interpolate.endSymbol('))');
			}]);

			app.__defineGetter__(name, function () {
				return application;
			});

			return angular.extend(app[name], {
				init: function init() {
					angular.bootstrap(document, [name]);
				}
			});

		} else {
			console.error(app_text.error_create);
		}
	};

	return app;
});