define([
    'backbone',
	'angular.ui'
], function ( Backbone) {
    // Initialize routing and start Backbone.history()
    return function () {
        //new Workspace();
        Backbone.history.start();

        // Initialize the application view
        //new AppView();
    };
});
