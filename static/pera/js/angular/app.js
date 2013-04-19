'use strict';

define(['pera/js/angular/common/app'], function (common_app) {
	var peraApp = common_app.define('pera');
	(function (app) {
		app = app || {};
		var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

		var push = ArrayProto.push,
			slice = ArrayProto.slice,
			concat = ArrayProto.concat,
			toString = ObjProto.toString,
			hasOwnProperty = ObjProto.hasOwnProperty;

		var nativeForEach = ArrayProto.forEach,
			nativeMap = ArrayProto.map,
			nativeReduce = ArrayProto.reduce,
			nativeReduceRight = ArrayProto.reduceRight,
			nativeFilter = ArrayProto.filter,
			nativeEvery = ArrayProto.every,
			nativeSome = ArrayProto.some,
			nativeIndexOf = ArrayProto.indexOf,
			nativeLastIndexOf = ArrayProto.lastIndexOf,
			nativeIsArray = Array.isArray,
			nativeKeys = Object.keys,
			nativeBind = FuncProto.bind;

		var idCounter = 0;
		app.uniqueId = function (prefix) {
			var id = ++idCounter + '';
			return prefix ? prefix + id : id;
		};

		app.result = function (object, property) {
			if (object == null) return null;
			var value = object[property];
			return app.isFunction(value) ? value.call(object) : value;
		};

		app.pick = function (obj) {
			var copy = {};
			var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
			app.each(keys, function (key) {
				if (key in obj) copy[key] = obj[key];
			});
			return copy;
		};

		app.keys = nativeKeys || function (obj) {
			if (obj !== Object(obj)) throw new TypeError('Invalid object');
			var keys = [];
			for (var key in obj) if (app.has(obj, key)) keys[keys.length] = key;
			return keys;
		};

		app.values = function (obj) {
			var values = [];
			for (var key in obj) if (app.has(obj, key)) values.push(obj[key]);
			return values;
		};

		app.pairs = function (obj) {
			var pairs = [];
			for (var key in obj) if (app.has(obj, key)) pairs.push([key, obj[key]]);
			return pairs;
		};

		app.invert = function (obj) {
			var result = {};
			for (var key in obj) if (app.has(obj, key)) result[obj[key]] = key;
			return result;
		};

		app.functions = app.methods = function (obj) {
			var names = [];
			for (var key in obj) {
				if (app.isFunction(obj[key])) names.push(key);
			}
			return names.sort();
		};

		app.isEmpty = function (obj) {
			if (obj == null) return true;
			if (app.isArray(obj) || app.isString(obj)) return obj.length === 0;
			for (var key in obj) if (app.has(obj, key)) return false;
			return true;
		};

		app.isElement = function (obj) {
			return !!(obj && obj.nodeType === 1);
		};

		app.has = function (obj, key) {
			return hasOwnProperty.call(obj, key);
		};

		app.defaults = function (obj) {
			app.each(slice.call(arguments, 1), function (source) {
				if (source) {
					for (var prop in source) {
						if (obj[prop] == null) obj[prop] = source[prop];
					}
				}
			});
			return obj;
		};

		app.toJson = angular.toJson;
		app.fromJson = angular.fromJson;
		app.each = angular.forEach;
		app.extend = angular.extend;
		app.isEqual = angular.equals;
		app.isUndefined = angular.isUndefined;
		app.clone = angular.copy;
		app.isArray = angular.isArray;
		app.isObject = angular.isObject;
		app.isFunction = angular.isFunction;
		app.isString = angular.isString;
		app.isNumber = angular.isNumber;
		app.isDate = angular.isDate;

		// Super amazing, cross browser property function, based on http://thewikies.com/
		app.defineProperty = function (obj, name, args) {
			// wrapper functions
			var
				oldValue = obj[name],
				getFn = function () {
					return args.get.apply(obj, [oldValue]);
				},
				setFn = function (newValue) {
					console.log('new value', newValue );
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
		}
	}).call(window, peraApp);
	return peraApp;
});