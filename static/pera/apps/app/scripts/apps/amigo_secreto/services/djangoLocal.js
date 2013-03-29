'use-strict';

define([
	'common.app',
	'angular.resource'
], function (app) {
	var CALLBACK_TOKEN   = 'JSON_CALLBACK';
  app.define('djangoLocal', ['ngResource']).factory('localResource', function($resource) {
      var Obj = $resource('/api/v2/amigo_secreto/:class/:id', { id: "@id", class: "@class" },{
                  update: { method: 'PUT' },
                  query: { method: 'JSONP', params:{callback: CALLBACK_TOKEN, format: 'jsonp'}, isArray: true},
                  get: { method: 'JSONP', params: {callback: CALLBACK_TOKEN, format: 'jsonp'}}
              }
      );
      Obj.prototype.update = function(cb) {
          return Obj.update({id: this.id}, angular.extend({}, this), cb);
      };
      return Obj;
  });
});