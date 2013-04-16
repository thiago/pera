'use strict';
/* TODO: Service extructure;
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
define(['pera/js/angular/app'], function (app) {

	var api_schema = {
		"todo": {
			"list_endpoint": "/api/v1/todo/",
			"schema": "/api/v1/todo/schema/"
		},
		"user": {
			"list_endpoint": "/api/v1/user/",
			"schema": "/api/v1/user/schema/"
		}
	};

	var METHODS = [
		"get",
		"post",
		"put",
		"delete",
		"patch"
	];

	function Manager(model) {
		var self = this;
		var get = function (args) {
			return $http.get('/api/product/' + id).then(function (response) {
				return new Api(response.data);
			});
		}
	}

	function Model(args) {
		var self = this;

		var append_slash = function (url) {
			var rtn = url;
			if (self._meta.append_slash) {
				rtn = url[url.length - 1] == '/' ? url : url + '/';
			}
			return rtn
		};

		var get_url = function () {
			var rtn = [
				self._meta.url_base,
				self._meta.app_label
			].join('/');
			return append_slash(rtn);
		};
	}
	Model.extend = function(args){
		return function(){
			try {
				if (!args || typeof(args) != 'string') {
					if (!args.app_label) throw 'Você deve informar um nome para seu modelo com o atributo \'name\'';
					if (!angular.isArray(args.detail_methods)) throw 'O atributo \'detail_http_methods\' deve ser um Array';
					if (!angular.isArray(args.list_methods)) throw 'O atributo \'list_http_methods\' deve ser um Array';
				}
			} catch (err) {
				console.error(err);
				return;
			}

			var default_meta = {
				name: null,
				url_base: '/api',
				append_slash: false,
				detail_methods: METHODS,
				list_methods: METHODS
			};

			if(typeof(args) == 'string'){
				this._meta = angular.extend(default_meta, {name: args});
			}else{
				this._meta = angular.extend(default_meta, args);
			}
		}
	};

	return app.factory('PeraService', ['$http', function ($http) {
		var Api = function (data) {
			angular.extend(this, data);
		};

		Api.prototype.url = '';

		Api.get = function (id) {
			return $http.get('/api/product/' + id).then(function (response) {
				return new Api(response.data);
			});
		};

		Api.all = function () {
			return $http.get('/api/product/').then(function (response) {
				return response.data.objects;
			});
		};

		Api.create = function (product) {
			return $http.post('/api/product/', product).success(function (response) {
				return response.data;
			}).error(function (data) {
					console.log(data);
				});
		};

		Api.prototype.update = function () {
			var product = this;
			return $http.put('/api/product/' + product.id + '/', product).then(function (response) {
				return response.data;
			});
		};

		Api.prototype.remove = function (id) {
			return $http.delete('/api/product/' + id + '/').success(function () {
				console.log("delete successful");
			});
		};

		return Api;
	}]);
});