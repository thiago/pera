'use-strict';

define(['apps/api/app'], function (app) {
	app.factory('Tastypie', ['$http', function($http){
		var _default     = {
			schema          : 'schema',
			url             : 'amigo_secreto/group',
			config          : {
				method: 'JSONP',
				params: {
					format: 'jsonp',
					callback:'JSON_CALLBACK'
				}
			}
		};
		/* TODO: Api extructure;
			url: string
			attributes: object
			update (attributes) return object updated
			delete () return true if success or false
			objects:
				all (params) return promisse
				create (attributes) post method
				get (attributes) jsonp method
				patch (createList, deleteList) patch method

		 */
		var Api = function(data) {
			angular.extend(this, data);
		};

		Api.prototype.url   = '';
		Api.prototype.url   = '';
		Api.get = function(id) {
			return $http.get('/api/product/' + id).then(function(response) {
				return new Api(response.data);
			});
		};

		Api.all = function() {
			return $http.get('/api/product/').then(function(response) {
				return response.data.objects;
			});
		};

		Api.create = function(product) {
			return $http.post('/api/product/', product).success(function(response) {
				return response.data;
			}).error(function(data){
					console.log(data);
				});
		};

		Api.prototype.update = function() {
			var product = this;
			return $http.put('/api/product/' + product.id + '/', product).then(function(response) {
				return response.data;
			});
		};

		Api.prototype.remove = function(id) {
			return $http.delete('/api/product/' + id + '/').success(function(){
				console.log("delete successful");
			});
		};

		return Api;

		var Obj                 = {
			urlBase         : "/api/v1",
			pathBase        : "amigo_secreto/group",
			config          : {
				method: "JSONP",
				params: {
					format: 'jsonp',
					callback:CALLBACK_TOKEN
				}
			},
			getURL          : function(id){
				return [
					this.urlBase,
					this.pathBase,
					id || ""
				].join("/");
			},
			getConfig       : function(params){
				var config      = angular.copy(this.config);
				return angular.extend(config, params);
			},
			request         : function(url, config, success, error){
				success         = success   || this.success;
				error           = error     || this.error;
				return $http.jsonp(url, config).success(success).error(error);
			},
			success         : function(data){
				console.log('JSONP Success', data);
			},
			error           : function(data, status){
				console.log('JSONP Error', data, status);
			},
			get             : function(id, config, success, error){
				return this.request(this.getURL(id), this.getConfig(config), success, error);
			},
			query             : function(config){
				var success          = config.success || function(data){
					return data['objects'];
				};
				return this.request(this.getURL(), this.getConfig(config), success, config.error);
			}
		};

		return Obj;
	}]);
});