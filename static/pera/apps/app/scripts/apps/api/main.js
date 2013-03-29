'use strict';
define([
	'../../../config'
], function mainApiModule() {
	require([
		"lodash",
		"angular",
		'apps/api/app',
		//"angular.ui.directives.date",
		'bootstrap.dropdown',
		'bootstrap.tooltip',
		"bootstrap.modal",
		'scripts/services/tastypie',
		'apps/api/controllers/home'
	], function (_, angular, api){
		api.config(['$routeProvider', '$interpolateProvider', function ($routes, $interpolate) {
			$interpolate.startSymbol('((');
			$interpolate.endSymbol('))');
			$routes.when('/', {
				templateUrl: 'views/api/home.html',
				controller: 'Main'
			});
		}]);

		api.run(function($rootScope, $log, Tastypie){
			console.log(Tastypie);
			//Tastypie.getAll('/api')
			$rootScope._            		    = _;
			$rootScope.relateds            	= {};
			$rootScope.log            		  = $log;
			$rootScope.currentRelated       = null;
			$rootScope.methods              = [];
			$rootScope.currentMethod        = $rootScope.methods[0];
			$rootScope.currentUrl           = '/api/v1';
			$rootScope.activeMethod         = function(method){
				if(method)
					$rootScope.currentMethod        = method;
				else
					return $rootScope.currentMethod;
			};

			$rootScope.addRelated              	= function(fieldData){
				console.log(fieldData);
				$("#modalAddRelated").modal('show');
			};
		});

		api.controller('Navbar', function ($scope, $route) {
			$scope.$route     = $route;
		});

		api.controller('Main', function ($scope, $rootScope, $http, $cacheFactory) {
			var cacheData                   = $cacheFactory('Api');
			var getData                     = function(url){
				var cached = cacheData.get(url);
				if (!cached) {
					cached = $http.get(url);
					cacheData.put(url, cached);
				}
				return cached;
			};

			$scope.get                      	= function(url, field){
				getData(url).success(function(data){
					$rootScope.relateds[field]		= data;
				});
			};
			$scope.root                      	= $rootScope;
			$scope.url                      	= "";
			$scope.versions                 	= ['v1', 'v2'];
			$scope.version                  	= $scope.versions[0];
			$scope.option                  		= '';
			$scope.data                     	= {};
			$scope.apis                       = {};
			$scope.fieldAttrs               	= [];

			$rootScope.$watch("relateds", function(relateds){
				console.log(relateds);
			});
			$rootScope.$watch("currentUrl", function(url){
				getData(url).success(function(data){
					if(!data.fields){
						$scope.apis[url]            = data;
						$scope.options              = [];
						for(var key in data){
							var novo                = {};
							novo.name               = key;
							novo.schema             = data[key].schema;
							novo.list               = data[key].list_endpoint;
							$scope.options.push(novo);
						}
						$scope.option              = $scope.options[0];
					}else{
						var fields              = [];
						$scope.data             = data;
						for(var field in data.fields){
							for(var attr in data.fields[field]){
								if(attr.charAt(0) != "$") fields.push(attr);
							}
						}
						$scope.fieldAttrs            = _.uniq(fields).sort(function (a, b) {
							if (a < b) return -1;
							if (b < a) return 1;
							return 0;
						});
					}
				});
			});
		});
		api.init();
	});
});