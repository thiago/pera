/*global require*/
'use strict';

require(['angular', 'app', 'controllers/todo', 'directives/todoFocus', 'directives/todoBlur'], function (angular) {
	angular.bootstrap(document, ['todomvc']);
});
