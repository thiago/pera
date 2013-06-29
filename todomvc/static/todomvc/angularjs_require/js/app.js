/*global define*/
'use strict';

define(['angular'], function (angular) {
	var app            = angular.module('todomvc', []);
	app.config(['$interpolateProvider', function ($interpolate) {
		$interpolate.startSymbol('((');
		$interpolate.endSymbol('))');
	}]);
	return app;
});
