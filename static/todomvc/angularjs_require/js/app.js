/*global define*/
'use strict';

define(['angular', 'i18n!../../nls/todo'], function (angular, todo_i18n) {
	var app            = angular.module('todomvc', []);
	app.config(['$interpolateProvider', function ($interpolate) {
		$interpolate.startSymbol('((');
		$interpolate.endSymbol('))');
	}]).run(['$rootScope', function($rootScope){
		$rootScope.i18n = todo_i18n;
	}]);
	return app;
});
