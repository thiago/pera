(function () {
	var root = this;
	var Pera;
	if (typeof exports !== 'undefined') {
		Pera = exports;
	} else {
		Pera = root.Pera = {};
	}
	Pera.VERSION = '0.0.0';
	var _current = root._ || root.angular;

	var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	var slice = ArrayProto.slice,
		concat = ArrayProto.concat,
		hasOwnProperty = ObjProto.hasOwnProperty;
	var nativeKeys = Object.keys;

	var idCounter = 0;
	Pera._uniqueId = _current.uniqueId || function (prefix) {
		var id = ++idCounter + '';
		return prefix ? prefix + id : id;
	};

	Pera._result = _current.result || function (object, property) {
		if (object == null) return null;
		var value = object[property];
		return Pera._isFunction(value) ? value.call(object) : value;
	};

	Pera._pick = _current.pick || function (obj) {
		var copy = {};
		var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
		Pera._each(keys, function (key) {
			if (key in obj) copy[key] = obj[key];
		});
		return copy;
	};

	Pera._keys = _current.keys || nativeKeys || function (obj) {
		if (obj !== Object(obj)) throw new TypeError('Invalid object');
		var keys = [];
		for (var key in obj) if (Pera._has(obj, key)) keys[keys.length] = key;
		return keys;
	};

	Pera._values = _current.values || function (obj) {
		var values = [];
		for (var key in obj) if (Pera._has(obj, key)) values.push(obj[key]);
		return values;
	};

	Pera._pairs = _current.pairs || function (obj) {
		var pairs = [];
		for (var key in obj) if (Pera._has(obj, key)) pairs.push([key, obj[key]]);
		return pairs;
	};

	Pera._invert = _current.invert || function (obj) {
		var result = {};
		for (var key in obj) if (Pera._has(obj, key)) result[obj[key]] = key;
		return result;
	};

	Pera._functions = Pera._methods = _current.functions || _current.methods || function (obj) {
		var names = [];
		for (var key in obj) {
			if (Pera._isFunction(obj[key])) names.push(key);
		}
		return names.sort();
	};

	Pera._isEmpty = _current.isEmpty || function (obj) {
		if (obj == null) return true;
		if (Pera._isArray(obj) || Pera._isString(obj)) return obj.length === 0;
		for (var key in obj) if (Pera._has(obj, key)) return false;
		return true;
	};

	Pera._isElement = _current.isElement || function (obj) {
		return !!(obj && obj.nodeType === 1);
	};

	Pera._has = _current.has || function (obj, key) {
		return hasOwnProperty.call(obj, key);
	};

	Pera._defaults = _current.defaults || function (obj) {
		Pera._each(slice.call(arguments, 1), function (source) {
			if (source) {
				for (var prop in source) {
					if (obj[prop] == null) obj[prop] = source[prop];
				}
			}
		});
		return obj;
	};

	Pera._toJson = _current.toJson || JSON.stringify;
	Pera._fromJson = _current.fromJson || JSON.parse;
	Pera._each = _current.each || _current.forEach;
	Pera._isEqual = _current.isEqual || _current.equals;
	Pera._clone = _current.clone || _current.copy;
	Pera._extend = _current.extend;
	Pera._isUndefined = _current.isUndefined;
	Pera._isArray = _current.isArray;
	Pera._isObject = _current.isObject;
	Pera._isFunction = _current.isFunction;
	Pera._isString = _current.isString;
	Pera._isNumber =_current.isNumber;
	Pera._isDate = _current.isDate;

	// Super amazing, cross browser property function, based on http://thewikies.com/
	Pera._defineProperty = function (obj, name, args) {
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

	var methodMap = {
		'create': 'POST',
		'update': 'PUT',
		'patch': 'PATCH',
		'delete': 'DELETE',
		'read': 'GET'
	};

	var urlError = function () {
		throw new Error('A "url" property or function must be specified');
	};

	var extend = function (protoProps, staticProps) {
		var parent = this;
		var child;
		if (protoProps && Pera._has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function () {
				return parent.apply(this, arguments);
			};
		}
		Pera._extend(child, parent, staticProps);
		var Surrogate = function () {
			this.constructor = child;
		};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;
		if (protoProps) Pera._extend(child.prototype, protoProps);
		child.__super__ = parent.prototype;
		return child;
	};

	Pera.Sync = function (method, model, options) {

		var type = methodMap[method];

		// Default JSON-request options.
		var params = {method: type};

		// Ensure that we have a URL.
		if (!options.url) {
			params.url = Pera._result(model, 'url') || urlError();
		}

		if (type == 'GET') {
			params.method = 'JSONP';
			params.params = Pera._extend({callback: 'JSON_CALLBACK'}, options.params || {});
		}

		if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
			params.data = options.attrs || model.toJson(options);
		}

		//model.trigger('request', model, xhr, options);
		return $http(params).
			success(function (data, status, headers, config) {
				//model.trigger('sync', model, resp, options);
			}).
			error(function (data, status, headers, config) {
				//model.trigger('error', model, xhr, options);
			});
	};

	Pera.Meta = function(args){
		Pera._extend(this, {
			id_attribute: 'id',
			append_slash: false,
			url_base: ''
		}, args);
	};

	Pera.QuerySet = function(args){
		this.initialize = function(){

		};
	};

	Pera.Manager = function(){

	};

	Pera.Model = function (attributes, options) {
		var defaults;
		var attrs = attributes || {};
		this.cid = Pera._uniqueId('c');
		this.attributes = {};
		if (options && options.collection) this.collection = options.collection;
		if (options && options.parse) attrs = this.parse(attrs, options) || {};
		if (defaults = Pera._result(this, 'defaults')) {
			attrs = Pera._defaults({}, attrs, defaults);
		}
		//this.set(attrs, options);
		this.changed = {};

		/*this.objects = Pera._clone(Array);
		 Pera._extend(this.objects, this.constructor.objects, {
		 models: this.constructor
		 });
		 Pera._extend(this.objects.prototype, this.constructor.objects.prototype, {
		 models: this.constructor
		 });*/
		//this.initialize.apply(this, arguments);
	};
	Pera._extend(Pera.Model.prototype, {
		sync: function(){
			return this.constructor.sync.apply(this, arguments);
		}
	});
	Pera.Model.sync = Pera.Sync;
	Pera.Model.extend = Pera.Sync.extend = extend;

}).call(this);

var a = Pera.Model.extend({},{sync: function(){console.log('entrou');}});
var b = new a();
a.sync();
b.sync();
Pera.Model.sync('read', {}, {});