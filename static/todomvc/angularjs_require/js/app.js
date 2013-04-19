/*global define*/
'use strict';

define(['angular', 'i18n!../../nls/todo', 'pera/js/angular/app'], function (angular, todo_i18n, pera_app) {
	var app            = angular.module('todomvc', ['pera']);
	app.config(['$interpolateProvider', function ($interpolate) {
		$interpolate.startSymbol('((');
		$interpolate.endSymbol('))');
	}]).run(['$rootScope', function($rootScope){
		$rootScope.i18n = todo_i18n;
	}]);
	return app;
});
