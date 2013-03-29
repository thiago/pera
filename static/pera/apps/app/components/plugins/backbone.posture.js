/*! Backbone.Posture - v0.1.0 - 2012-04-14
* https://github.com/anthonyshort/backbone.posture
* Copyright (c) 2012 Anthony Short; Licensed MIT */

(function() {
  'use strict';
  var Subscriber, emitter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Backbone.Posture = {};

  emitter = Backbone.Posture.EventEmitter = _.extend({}, Backbone.Events);

  Backbone.Posture.Subscriber = Subscriber = {
    subscribeEvent: function(type, handler) {
      emitter.off(type, handler, this);
      return emitter.on(type, handler, this);
    },
    unsubscribeEvent: function(type, handler) {
      return emitter.off(type, handler);
    },
    unsubscribeAllEvents: function() {
      return emitter.off(null, null, this);
    },
    triggerEvent: function() {
      return emitter.trigger.apply(this, arguments);
    }
  };

  if (typeof Object.freeze === "function") Object.freeze(Subscriber);

  Backbone.Posture.Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      this.dispose = __bind(this.dispose, this);
      Model.__super__.constructor.apply(this, arguments);
    }

    _.extend(Model.prototype, Subscriber);

    Model.prototype.defer = function() {
      return _(this).extend($.Deferred());
    };

    Model.prototype.getAttributes = function() {
      return this.attributes;
    };

    Model.prototype.dispose = function() {
      var prop, properties, _i, _len;
      if (this.disposed) return;
      this.trigger('dispose', this);
      this.unsubscribeAllEvents();
      this.off();
      properties = ['collection', 'attributes', '_escapedAttributes', '_previousAttributes', '_silent', '_pending', 'view'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      return this.disposed = true;
    };

    return Model;

  })(Backbone.Model);

  Backbone.Posture.View = (function(_super) {

    __extends(View, _super);

    function View() {
      this.dispose = __bind(this.dispose, this);
      View.__super__.constructor.apply(this, arguments);
    }

    _.extend(View.prototype, Subscriber);

    View.prototype.render = function() {
      var html;
      if (!this.template) return;
      if (typeof this.template === 'string') {
        this.template = Handlebars.compile(this.template);
      }
      html = this.template(this.getTemplateData());
      this.$el.empty().append(html);
      return this;
    };

    View.prototype.getTemplateData = function() {
      var modelAttributes, templateData;
      modelAttributes = this.model && this.model.getAttributes();
      templateData = _.clone(modelAttributes);
      return templateData;
    };

    View.prototype.dispose = function() {
      var prop, properties, _i, _len, _ref;
      if (this.disposed) return;
      this.unsubscribeAllEvents();
      this.off();
      if ((_ref = this.$el) != null) _ref.remove();
      properties = ['el', '$el', '$container', 'options', 'model', 'collection', '_callbacks'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      return this.disposed = true;
    };

    return View;

  })(Backbone.View);

  Backbone.Posture.Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      this.dispose = __bind(this.dispose, this);
      Collection.__super__.constructor.apply(this, arguments);
    }

    _.extend(Collection.prototype, Subscriber);

    Collection.prototype.defer = function() {
      return _(this).extend($.Deferred());
    };

    Collection.prototype.addAtomic = function(models, options) {
      var batch_direction, model;
      if (options == null) options = {};
      if (!models.length) return;
      options.silent = true;
      batch_direction = typeof options.at === 'number' ? 'pop' : 'shift';
      while (model = models[batch_direction]()) {
        this.add(model, options);
      }
      return this.trigger('reset');
    };

    Collection.prototype.update = function(newList, options) {
      var fingerPrint, i, ids, model, newFingerPrint, preexistent, _ids, _len, _results;
      if (options == null) options = {};
      fingerPrint = this.pluck('id').join();
      ids = _(newList).pluck('id');
      newFingerPrint = ids.join();
      if (fingerPrint !== newFingerPrint) {
        _ids = _(ids);
        i = this.models.length - 1;
        while (i >= 0) {
          model = this.models[i];
          if (!_ids.include(model.id)) this.remove(model);
          i--;
        }
      }
      if (!(fingerPrint === newFingerPrint && !options.deep)) {
        _results = [];
        for (i = 0, _len = newList.length; i < _len; i++) {
          model = newList[i];
          preexistent = this.get(model.id);
          if (preexistent) {
            if (!options.deep) continue;
            _results.push(preexistent.set(model));
          } else {
            _results.push(this.add(model, {
              at: i
            }));
          }
        }
        return _results;
      }
    };

    Collection.prototype.dispose = function() {
      var prop, properties, _i, _len;
      if (this.disposed) return;
      this.trigger('dispose', this);
      this.unsubscribeAllEvents();
      this.off();
      this.reset([], {
        silent: true
      });
      properties = ['model', 'models', '_byId', '_byCid'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      return this.disposed = true;
    };

    return Collection;

  })(Backbone.Collection);

  Backbone.Posture.Subset = (function(_super) {

    __extends(Subset, _super);

    function Subset(options) {
      var _this = this;
      if (options == null) options = {};
      if (options.comparator) {
        this.comparator = options.comparator;
        delete options.comparator;
      }
      if (!options.superset) throw "Subset must have a superset option!";
      if (!options.filter) throw "Subset must have a filter option!";
      if (!(options.superset instanceof Backbone.Collection && options.superset instanceof Backbone.Subset)) {
        throw "Subset must have a Backbone.Collection or Backbone.Subset as its superset!";
      }
      if (options.transform) this.transform = options.transform;
      this.filter = options.filter;
      this.superset = options.superset;
      this.superset.bind('all', function(event, model) {
        var id;
        id = _this.get(model.id) || false;
        _this._reset();
        if (model instanceof Backbone.Model) {
          if (_this.filter(model)) {
            return _this.trigger.apply(_this, arguments);
          } else if (id) {
            return _this.trigger.apply(_this, ['removeFromSubset', event, model]);
          }
        } else {
          return _this.trigger.apply(_this, arguments);
        }
      });
      delete options.filter;
      delete options.superset;
      this._reset();
      this.initialize(options);
    }

    Subset.prototype.transform = function(models) {
      return models;
    };

    Subset.prototype.toJSON = function() {
      return this.map(function(model) {
        return model.toJSON();
      });
    };

    Subset.prototype.add = function(models, options) {
      this.superset.add(models, options);
      return this;
    };

    Subset.prototype.remove = function(models, options) {
      if (!_.isArray(models)) models = [models];
      models = _.filter(models, function(model) {
        return model !== null;
      });
      this.superset.remove(_.filter(models, this.filter), options);
      return this;
    };

    Subset.prototype.get = function(id) {
      return _.find(this.models, function(model) {
        return model.id === id;
      });
    };

    Subset.prototype.getByCid = function(cid) {
      return _.find(this.models, function(model) {
        return model.cid === cid;
      });
    };

    Subset.prototype.at = function(index) {
      return this.models[index];
    };

    Subset.prototype.sort = function(options) {
      this.superset.sort(options);
      return this;
    };

    Subset.prototype.pluck = function(attr) {
      return _.map(this.models, function(model) {
        return model.get(attr);
      });
    };

    Subset.prototype.refresh = function(models, options) {
      return this.superset.refresh(models, options);
    };

    Subset.prototype.fetch = function(options) {
      return this.superset.fetch(options);
    };

    Subset.prototype.create = function(model, options) {
      return this.superset.create(model, options);
    };

    Subset.prototype.parse = function(resp) {
      return resp;
    };

    Subset.prototype.length = function() {
      this._reset();
      return this.models.length;
    };

    Subset.prototype.chain = function() {
      return this.superset.chain();
    };

    Subset.prototype._reset = function() {
      this.model = this.options.model || this.superset.model;
      return this.models = this._models();
    };

    Subset.prototype._models = function() {
      var models;
      models = this.transform(this.superset.models);
      models = _.filter(models, function(i) {
        return i !== null;
      });
      return _.filter(models, this.filter);
    };

    return Subset;

  })(Backbone.Posture.Collection);

  (function() {
    var method, methods, _i, _len, _results;
    methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'rest', 'last', 'without', 'indexOf', 'lastIndexOf', 'isEmpty'];
    _results = [];
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      method = methods[_i];
      _results.push(Backbone.Posture.Subset.prototype[method] = function() {
        return _[method].apply(_, [this._models()].concat(_.toArray(arguments)));
      });
    }
    return _results;
  })();

  Backbone.Posture.ModelView = (function(_super) {

    __extends(ModelView, _super);

    function ModelView() {
      ModelView.__super__.constructor.apply(this, arguments);
    }

    ModelView.prototype.initialize = function(options) {
      ModelView.__super__.initialize.apply(this, arguments);
      if (!options.model) throw 'DURP DURP Backbone.ModelView requires a model';
      this.modelEvents || (this.modelEvents = {});
      return this.addModelEvents();
    };

    ModelView.prototype.addModelEvents = function() {
      var handler, name, _len, _ref, _results;
      this.model.on('dispose', this.dispose, this);
      this.model.on('destroy', this.dispose, this);
      this.model.on('remove', this.dispose, this);
      _ref = this.modelEvents;
      _results = [];
      for (name = 0, _len = _ref.length; name < _len; name++) {
        handler = _ref[name];
        _results.push(this.model.on(name, this[handler], this));
      }
      return _results;
    };

    ModelView.prototype.pass = function(attr, selector) {
      var change;
      change = function(model, val) {
        return this.$(selector).html(val);
      };
      return this.model.on('change:' + eventType, change, this);
    };

    ModelView.prototype.getTemplateData = function() {
      var modelAttributes, templateData;
      modelAttributes = this.model && this.model.getAttributes();
      templateData = _.clone(modelAttributes);
      return templateData;
    };

    ModelView.prototype.dispose = function() {
      var prop, _i, _len, _ref, _ref2, _results;
      ModelView.__super__.dispose.apply(this, arguments);
      if ((_ref = this.model) != null) _ref.off(null, null, this);
      _ref2 = ['model'];
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        prop = _ref2[_i];
        _results.push(delete this[prop]);
      }
      return _results;
    };

    return ModelView;

  })(Backbone.Posture.View);

  Backbone.Posture.CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      this.onReset = __bind(this.onReset, this);
      this.onRemove = __bind(this.onRemove, this);
      this.onAdd = __bind(this.onAdd, this);
      this.onReady = __bind(this.onReady, this);
      this.onLoad = __bind(this.onLoad, this);
      CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.itemView = null;

    CollectionView.prototype.emptyClass = 'empty';

    CollectionView.prototype.loadingClass = 'loading';

    CollectionView.prototype.itemSelector = null;

    CollectionView.prototype.listSelector = null;

    CollectionView.prototype.list = null;

    CollectionView.prototype.viewsByCid = null;

    CollectionView.prototype.initialize = function(options) {
      if (options == null) options = {};
      CollectionView.__super__.initialize.apply(this, arguments);
      if (!options.collection) {
        throw "Doh! Backbone.CollectionView requires a collection";
      }
      _(options).defaults({
        render: true,
        renderItems: true
      });
      this.viewsByCid = {};
      this.collectionEvents || (this.collectionEvents = {});
      this.addCollectionListeners();
      if (options.render) this.render();
      if (options.renderItems) return this.renderAllItems();
    };

    CollectionView.prototype.addCollectionListeners = function() {
      var handler, name, _len, _ref, _results;
      this.collection.on('add', this.onAdd, this);
      this.collection.on('remove', this.onRemove, this);
      this.collection.on('reset', this.onReset, this);
      this.collection.on('load', this.onLoad, this);
      this.collection.on('ready', this.onReady, this);
      _ref = this.collectionEvents;
      _results = [];
      for (name = 0, _len = _ref.length; name < _len; name++) {
        handler = _ref[name];
        _results.push(this.collection.on(name, this[handler], this));
      }
      return _results;
    };

    CollectionView.prototype.onLoad = function() {
      return this.$el.addClass(this.loadingClass);
    };

    CollectionView.prototype.onReady = function() {
      return this.$el.removeClass(this.loadingClass);
    };

    CollectionView.prototype.onAdd = function(model) {
      return this.addModelView(model);
    };

    CollectionView.prototype.onRemove = function(model) {
      return this.removeModelView(model);
    };

    CollectionView.prototype.onReset = function() {
      return this.renderAllItems();
    };

    CollectionView.prototype.render = function() {
      CollectionView.__super__.render.apply(this, arguments);
      this.list = this.listSelector ? this.$(this.listSelector) : this.$el;
      return this.initFallback();
    };

    CollectionView.prototype.initFallback = function() {
      if (this.collection.length === 0) {
        return this.$el.addClass(this.emptyClass);
      } else {
        return this.$el.removeClass(this.emptyClass);
      }
    };

    CollectionView.prototype.renderAllItems = function() {
      var _this = this;
      this.render();
      this.clear();
      return this.collection.each(function(model) {
        return _this.addModelView(model);
      });
    };

    CollectionView.prototype.clear = function() {
      var cid, model, view, _ref, _results;
      this.list.empty();
      _ref = this.viewsByCid;
      _results = [];
      for (cid in _ref) {
        if (!__hasProp.call(_ref, cid)) continue;
        view = _ref[cid];
        model = this.collection.get(cid);
        _results.push(this.removeModelView(model));
      }
      return _results;
    };

    CollectionView.prototype.getModelView = function(model) {
      if (!this.itemView) {
        throw 'Dang! Backbone.CollectionView needs an itemView property set. Alternatively override the getModelView method';
      }
      return new this.itemView({
        model: model
      });
    };

    CollectionView.prototype.addModelView = function(model) {
      var view;
      view = this.getModelView(model);
      view.render();
      this.viewsByCid[model.cid] = view;
      this.initFallback();
      this.renderItem(view, model);
      return view;
    };

    CollectionView.prototype.removeModelView = function(model) {
      var view;
      view = this.viewsByCid[model.cid];
      if (!view) return;
      view.dispose();
      delete this.viewsByCid[model.cid];
      return this.initFallback();
    };

    CollectionView.prototype.renderItem = function(view, model) {
      var children, position;
      children = this.list.children(this.itemSelector);
      position = this.collection.indexOf(model);
      if (position === 0) {
        return this.list.prepend(view.$el);
      } else if (position < children.length) {
        return children.eq(position).before(view.$el);
      } else {
        return this.list.append(view.$el);
      }
    };

    CollectionView.prototype.dispose = function() {
      var prop, _i, _len, _ref, _results;
      CollectionView.__super__.dispose.apply(this, arguments);
      this.collection.off(null, null, this);
      _ref = ['list', 'viewsByCid', 'el', '$el', 'collection'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        _results.push(delete this[prop]);
      }
      return _results;
    };

    return CollectionView;

  })(Backbone.Posture.View);

  Backbone.Posture.Controller = (function(_super) {

    __extends(Controller, _super);

    function Controller() {
      this.dispose = __bind(this.dispose, this);
      Controller.__super__.constructor.apply(this, arguments);
    }

    _(Controller.prototype).defaults(Subscriber);

    Controller.prototype.model = null;

    Controller.prototype.collection = null;

    Controller.prototype.view = null;

    Controller.prototype.dispose = function() {
      var prop, properties, _i, _len, _results;
      if (this.model) this.model.dispose();
      if (this.collection) this.collection.dispose();
      if (this.view) this.view.dispose();
      this.unsubscribeAllEvents();
      this.off();
      properties = 'model collection view'.split(' ');
      _results = [];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        _results.push(delete this[prop]);
      }
      return _results;
    };

    return Controller;

  })(Backbone.Router);

}).call(this);