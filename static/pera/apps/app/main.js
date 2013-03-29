'use strict';
define('main', [
	'config'
], function mainModule() {
		/*
		 angular.module('apiApp')
		 .controller('MainCtrl', ['$scope', function ($scope) {
		 $scope.awesomeThings = [
		 'HTML5 Boilerplate',
		 'AngularJS',
		 'Testacular'
		 ];
		 }]);
		 */
		require(['scripts/api/app', 'scripts/controllers/main'], function (app){
			app.api.config(['$routeProvider', function ($routeProvider) {
				$routeProvider.when('/', {
					templateUrl: 'views/main.html',
					controller: 'MainCtrl'
				}).otherwise({
						redirectTo: '/'
					});
			}]);
			app.init();
		});
	}
);