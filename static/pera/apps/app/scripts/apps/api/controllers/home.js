'use-strict';

define(['apps/api/app'], function (app) {
	app.controller('HomeCtrl', function ($scope) {
		$scope.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Testacular'
		];
	});
});