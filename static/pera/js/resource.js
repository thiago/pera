

(function () {
	'use strict';
	var root = this;
	var pera = root.pera = {};
	var $injector = angular.injector(['ng']);
	pera.VERSION = '0.0.0';

	var _ = root._ = root._ || root.angular;
	var ArrayProto = Array.prototype,
		ObjProto = Object.prototype,
		FuncProto = Function.prototype,
		slice = ArrayProto.slice,
		concat = ArrayProto.concat,
		hasOwnProperty = ObjProto.hasOwnProperty,
		nativeKeys = Object.keys;

	var methodMap = {
		'create': 'POST',
		'update': 'PUT',
		'patch': 'PATCH',
		'delete': 'DELETE',
		'read': 'GET'
	};

	var modelError = function () {
		throw new Error('A "model" must be specified');
	};

	var urlError = function () {
		throw new Error('A "url" property or function must be specified');
	};

	var extend = function (protoProps, staticProps) {
		var parent = this;
		var child;
		if (protoProps && _.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function () {
				return parent.apply(this, arguments);
			};
		}
		_.extend(child, parent, staticProps);
		var Surrogate = function () {
			this.constructor = child;
		};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;
		if (protoProps) _.extend(child.prototype, protoProps);
		child.__super__ = parent.prototype;
		return child;
	};

	// Super amazing, cross browser property function, based on http://thewikies.com/
	_.defineProperty = function (obj, name, args) {
		// wrapper functions
		var
			oldValue = obj[name],
			getFn = function () {
				return args.get.apply(obj, [oldValue]);
			},
			setFn = function (newValue) {
				return oldValue = args.set.apply(obj, [newValue]);
			};

		// Modern browsers, IE9+, and IE8 (must be a DOM object),
		if (Object.defineProperty) {
			Object.defineProperty(obj, name, {
				get: getFn,
				set: setFn
			});
			// Older Mozilla
		} else if (obj.__defineGetter__) {
			obj.__defineGetter__(name, getFn);
			obj.__defineSetter__(name, setFn);
			// IE6-7
			// must be a real DOM object (to have attachEvent) and must be attached to document (for onpropertychange to fire)
		} else {
			var onPropertyChange = function (e) {
				if (event.propertyName == name) {
					// temporarily remove the event so it doesn't fire again and create a loop
					obj.detachEvent("onpropertychange", onPropertyChange);
					// get the changed value, run it through the set function
					var newValue = setFn(obj[name]);
					// restore the get function
					obj[name] = getFn;
					obj[name].toString = getFn;
					// restore the event
					obj.attachEvent("onpropertychange", onPropertyChange);
				}
			};
			obj[name] = getFn;
			obj[name].toString = getFn;
			obj.attachEvent("onpropertychange", onPropertyChange);
		}
	};

	pera.sync = function () {
		var config = arguments;
		return $injector.invoke(['$http', function($http){
			return $http(config);
		}]);
	};

	pera.QuerySet = function(model, options){
		var constr = _.isFunction(model) ? model.constructor : model;

		var i,
			methods = [
				'join', 'reverse', 'sort', 'push', 'pop', 'shift', 'unshift',
				'splice', 'concat', 'slice', 'indexOf', 'lastIndexOf',
				'forEach', 'map', 'reduce', 'reduceRight', 'filter',
				'some', 'every', 'isArray'
			],
			methodCount = methods.length,
			methodDefault = {};

		for (i = 0; i < methodCount; i++) {
			var methodName = methods[i];
			methodDefault[methodName] = (function(name){
				return function () {
					ArrayProto[name].apply(this, arguments);
					return this;
				}
			})(methodName);
		}
		this.model = model;
		_.extend(methodDefault, {
			all: function(){
				model.sync('read', model, options);
				return this;
			},
			objects: function(){
				return this.model.constructor.objects.apply(model, arguments);
			}
		});

		return methodDefault;
	};

	_.extend(pera.QuerySet.prototype, {
		parse: function(){
			console.log();
		},
		get_config: function(method, options){
			var type = this.methodMap[method];
			var params = {method: type};

			if (!options.url) {
				params.url = _.result(this.model, 'url') || urlError();
			}

			if (type == 'GET') {
				params.method = 'JSONP';
				params.params = _.extend({callback: 'JSON_CALLBACK'}, options.params || {});
			}

			if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
				params.data = options.attrs || model.toJson(options);
			}
			return params;
		},
		success: function(fn){
			if(_.isFunction(fn)) return fn.apply(this, arguments);
		},
		error: function(fn){
			if(_.isFunction(fn)) return fn.apply(this, arguments);
		},
		then: function(fn){
			if(_.isFunction(fn)) return fn.apply(this, arguments);
		}
	});

	pera.Model = function (attributes, options) {
		options = options || {};
		var defaults;
		var attrs = attributes || {};
		this.cid = _.uniqueId('c');
		this.attributes = {};
		this.changed = {};
		this.append_slash = _.has(options, 'objects') ? options.objects : false;
		if (options && options.collection) this.collection = options.collection;
		if (options && options.parse) attrs = this.parse(attrs, options) || {};
		if (defaults = _.result(this, 'defaults')) {
			attrs = _.defaults({}, attrs, defaults);
		}
		//this.set(attrs, options);
		this.initialize.apply(this, arguments);
		//console.log('Model:constructor', this, attributes, options);
	};

	_.extend(pera.Model.prototype, {
		initialize: function(){},
		sync: function(){
			return this.constructor.sync.apply(this, arguments);
		},
		objects: function(){
			return this.constructor.objects.apply(this, arguments);
		}
	});

	pera.Model.objects = function(options){
		var self = _.isFunction(this) ? this.prototype : this;
		var container = [];
		var get_query_set = function(){
			return new pera.QuerySet(self, options);
		};
		return {
			all: function(opt){
				return get_query_set().all(opt);
			}
		};
	};

	pera.Model.sync = function(){
		return new pera.Sync(arguments);
	};

	pera.Model.extend = function(prot, stat){
		if(!prot || !prot.container) _.extend(prot, {container: []});
		return extend.apply(this, arguments);
	};
	pera.Sync.extend = pera.QuerySet.extend = extend;

}).call(this);

var log = console.log,
	error = console.error;
var a = pera.Model.extend({url: '/api/v1/todo'});
var c = pera.Model.extend({url: '/api/v1/user'});
var b = new a();
var d = new c();
//a.sync('read', {}, {});
//b.sync('read', {}, {});
log('test', a.objects('asd'));
log('test', b.objects('asd'));
log('test', c.objects('asd'));

var e = a.extend({url: '/api/v1/todo/outro'});
var g = c.extend({url: '/api/v1/user/outro'});

log('test', d.objects('/api/v1/todo'));
log('test', e.objects('/api/v1/'));
log('test', g.objects('asd'));