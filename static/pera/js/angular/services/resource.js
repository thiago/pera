'use strict';
/*TODO: Service extructure;
 cid: String
 idAttribute: String
 url: String
 changed: Object
 attributes: Object
 constructor: Object Class
 update(attributes) return object updated
 delete() return true if success or false
 objects:

 QuerySet(Array){
 - init()
 - all (params) return promisse
 - create (attributes) post method
 - get (attributes) jsonp method
 - filter
 - order_by return collection
 - get_or_create(Array or Object) return collection
 - count ([force_update=false])
 - exclude(Array params) return collection
 - latest()
 - delete() return true or false;
 - update
 - values_list
 - values
 - distinct
 - reverse
 }
 */
define(['pera/js/angular/app'], function (app) {

	var $injector = angular.injector(['ng', 'pera']);
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
		if (protoProps && app.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function () {
				return parent.apply(this, arguments);
			};
		}
		app.extend(child, parent, staticProps);
		var Surrogate = function () {
			this.constructor = child;
		};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;
		if (protoProps) app.extend(child.prototype, protoProps);
		child.__super__ = parent.prototype;
		return child;
	};

	return app.factory('Model', ['$http', function ($http) {

		var Model = function (attributes, options) {
			var defaults;
			var self = this;
			var attrs = attributes || {};
			this.cid = app.uniqueId('c');
			this.attributes = {};
			if (options && options.collection) this.collection = options.collection;
			if (options && options.parse) attrs = this.parse(attrs, options) || {};
			if (defaults = app.result(this, 'defaults')) {
				attrs = app.defaults({}, attrs, defaults);
			}
			this.set(attrs, options);
			this.changed = {};

			/*this.objects = app.clone(Array);
			app.extend(this.objects, this.constructor.objects, {
				models: this.constructor
			});
			app.extend(this.objects.prototype, this.constructor.objects.prototype, {
				models: this.constructor
			});*/
			this.initialize.apply(this, arguments);
		};

		app.extend(Model.prototype, {
			changed: null,
			idAttribute: 'id',
			initialize: function () {},
			toJson: function (options) {
				return app.toJson(this.attributes);
			},

			sync: function () {
				return this.constructor.sync.apply(this, arguments);
			},

			// Get the value of an attribute.
			get: function (attr) {
				return this.attributes[attr];
			},

			// Returns `true` if the attribute contains a value that is not null
			// or undefined.
			has: function (attr) {
				return this.get(attr) != null;
			},

			// ----------------------------------------------------------------------

			// Set a hash of model attributes on the object, firing `"change"` unless
			// you choose to silence it.
			set: function (key, val, options) {
				var attr, attrs, unset, changes, silent, changing, prev, current;
				if (key == null) return this;

				// Handle both `"key", value` and `{key: value}` -style arguments.
				if (typeof key === 'object') {
					attrs = key;
					options = val;
				} else {
					(attrs = {})[key] = val;
				}

				options || (options = {});

				// Run validation.
				if (!this._validate(attrs, options)) return false;

				// Extract attributes and options.
				unset = options.unset;
				silent = options.silent;
				changes = [];
				changing = this._changing;
				this._changing = true;

				if (!changing) {
					this._previousAttributes = app.clone(this.attributes);
					this.changed = {};
				}
				current = this.attributes, prev = this._previousAttributes;

				// Check for changes of `id`.
				if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

				// For each `set` attribute, update or delete the current value.
				for (attr in attrs) {
					val = attrs[attr];
					if (!app.isEqual(current[attr], val)) changes.push(attr);
					if (!app.isEqual(prev[attr], val)) {
						this.changed[attr] = val;
					} else {
						delete this.changed[attr];
					}
					unset ? delete current[attr] : current[attr] = val;
				}

				// Trigger all relevant attribute changes.
				if (!silent) {
					if (changes.length) this._pending = true;
					for (var i = 0, l = changes.length; i < l; i++) {
						//this.trigger('change:' + changes[i], this, current[changes[i]], options);
					}
				}

				if (changing) return this;
				if (!silent) {
					while (this._pending) {
						this._pending = false;
						//this.trigger('change', this, options);
					}
				}
				this._pending = false;
				this._changing = false;
				return this;
			},

			// Remove an attribute from the model, firing `"change"` unless you choose
			// to silence it. `unset` is a noop if the attribute doesn't exist.
			unset: function (attr, options) {
				return this.set(attr, void 0, app.extend({}, options, {unset: true}));
			},

			// Clear all attributes on the model, firing `"change"` unless you choose
			// to silence it.
			clear: function (options) {
				var attrs = {};
				for (var key in this.attributes) attrs[key] = void 0;
				return this.set(attrs, app.extend({}, options, {unset: true}));
			},

			// Determine if the model has changed since the last `"change"` event.
			// If you specify an attribute name, determine if that attribute has changed.
			hasChanged: function (attr) {
				if (attr == null) return !app.isEmpty(this.changed);
				return app.has(this.changed, attr);
			},

			// Return an object containing all the attributes that have changed, or
			// false if there are no changed attributes. Useful for determining what
			// parts of a view need to be updated and/or what attributes need to be
			// persisted to the server. Unset attributes will be set to undefined.
			// You can also pass an attributes object to diff against the model,
			// determining if there *would be* a change.
			changedAttributes: function (diff) {
				if (!diff) return this.hasChanged() ? app.clone(this.changed) : false;
				var val, changed = false;
				var old = this._changing ? this._previousAttributes : this.attributes;
				for (var attr in diff) {
					if (app.isEqual(old[attr], (val = diff[attr]))) continue;
					(changed || (changed = {}))[attr] = val;
				}
				return changed;
			},

			// Get the previous value of an attribute, recorded at the time the last
			// `"change"` event was fired.
			previous: function (attr) {
				if (attr == null || !this._previousAttributes) return null;
				return this._previousAttributes[attr];
			},

			// Get all of the attributes of the model at the time of the previous
			// `"change"` event.
			previousAttributes: function () {
				return app.clone(this._previousAttributes);
			},

			// ---------------------------------------------------------------------

			// Fetch the model from the server. If the server's representation of the
			// model differs from its current attributes, they will be overriden,
			// triggering a `"change"` event.
			fetch: function (options) {
				options = options ? app.clone(options) : {};
				return this.sync('read', this, options);
			},

			// Set a hash of model attributes, and sync the model to the server.
			// If the server returns an attributes hash that differs, the model's
			// state will be `set` again.
			save: function (key, val, options) {
				var attrs, success, method, xhr, attributes = this.attributes;

				// Handle both `"key", value` and `{key: value}` -style arguments.
				if (key == null || typeof key === 'object') {
					attrs = key;
					options = val;
				} else {
					(attrs = {})[key] = val;
				}

				// If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
				if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return false;

				options = _extend({validate: true}, options);

				// Do not persist invalid models.
				if (!this._validate(attrs, options)) return false;

				// Set temporary attributes if `{wait: true}`.
				if (attrs && options.wait) {
					this.attributes = app.extend({}, attributes, attrs);
				}

				// After a successful server-side save, the client is (optionally)
				// updated with the server-side state.
				if (options.parse === void 0) options.parse = true;
				success = options.success;
				options.success = function(model, resp, options) {
					// Ensure attributes are restored during synchronous saves.
					model.attributes = attributes;
					var serverAttrs = model.parse(resp, options);
					if (options.wait) serverAttrs = _extend(attrs || {}, serverAttrs);
					if (app.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
						return false;
					}
					if (success) success(model, resp, options);
				};

				// Finish configuring and sending the Ajax request.
				method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
				if (method === 'patch') options.attrs = attrs;
				xhr = this.sync(method, this, options);

				// Restore attributes.
				if (attrs && options.wait) this.attributes = attributes;

				return xhr;
			},

			// Destroy this model on the server if it was already persisted.
			// Optimistically removes the model from its collection, if it has one.
			// If `wait: true` is passed, waits for the server to respond before removal.
			destroy: function (options) {
				options = options ? app.clone(options) : {};
				var model = this;
				var success = options.success;

				var destroy = function () {
					model.trigger('destroy', model, model.collection, options);
				};

				options.success = function (model, resp, options) {
					if (options.wait || model.isNew()) destroy();
					if (success) success(model, resp, options);
				};

				if (this.isNew()) {
					options.success(this, null, options);
					return false;
				}

				var xhr = this.sync('delete', this, options);
				if (!options.wait) destroy();
				return xhr;
			},

			// Default URL for the model's representation on the server -- if you're
			// using Backbone's restful methods, override this to change the endpoint
			// that will be called.
			url: function () {
				var base = app.result(this, 'urlRoot') || app.result(this.collection, 'url') || urlError();
				if (this.isNew()) return base;
				return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
			},

			// **parse** converts a response into the hash of attributes to be `set` on
			// the model. The default implementation is just to pass the response along.
			parse: function (resp, options) {
				return resp;
			},

			// Create a new model with identical attributes to this one.
			clone: function () {
				return new this.constructor(this.attributes);
			},

			// A model is new if it has never been saved to the server, and lacks an id.
			isNew: function () {
				return this.id == null;
			},

			// Check if the model is currently in a valid state.
			isValid: function (options) {
				return !this.validate || !this.validate(this.attributes, options);
			},

			// Run validation against the next complete set of model attributes,
			// returning `true` if all is well. Otherwise, fire a general
			// `"error"` event and call the error callback, if specified.
			_validate: function (attrs, options) {
				if (!options.validate || !this.validate) return true;
				attrs = app.extend({}, this.attributes, attrs);
				var error = this.validationError = this.validate(attrs, options) || null;
				if (!error) return true;
				//this.trigger('invalid', this, error, options || {});
				return false;
			}
		});

		Model.sync = function (method, model, options) {
			var type = methodMap[method];

			// Default JSON-request options.
			var params = {method: type};

			// Ensure that we have a URL.
			if (!options.url) {
				params.url = app.result(model, 'url') || urlError();
			}

			if (type == 'GET') {
				params.method = 'JSONP';
				params.params = app.extend({callback: 'JSON_CALLBACK'}, options.params || {});
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

		var ObjectsMethods = {
			all: function(options){
				return this;
				options = options ? app.clone(options) : {};
				return self.sync('read', self, options);
			}
		};


		Model.extend = Array.extend = extend;
		Model.Manager = Array.extend(ObjectsMethods, ObjectsMethods);


		var a = Model.extend({url: '/api/v1/todo'});
		var b = new a();
		window.Model = Model;
		app.each([
			['A', Model.Manager],
			['A', Model.Manager()]
		], function(data){
			var key = '',
				value = data;
			if(app.isArray(data) && data.length > 1){
				key = data[0];
				value = data[1];
			}

			window.app.push(value);
			console.log(key, value);
		});

		//console.log(app.keys(a), b, c);
		return Model;
	}]);
});