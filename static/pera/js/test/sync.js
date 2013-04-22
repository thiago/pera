(function(){

	module("pera.sync", {
		setup : function() {

		},

		teardown: function() {

		}

	});

	test("read", 1, function() {
		pera.sync();
		equal(this.url, '/s');
	});
	test( "hello test", function() {
		ok( 1 == "1", "Passed!" );
	});
}).call(this);