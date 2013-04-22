module.exports = function (grunt) {

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	var config = require('./static_dev/config'),
		spawn = require('child_process').spawn;

	var config_todomvc = config({
		static: 'static/',
		base: 'todomvc/backbone_require/js/',
		components: '../../../components/'
	});
	config_todomvc.out = '/foo';
	config_todomvc.name = 'main';
	console.log(config_todomvc);

	grunt.initConfig({
		pkg: '<json:package.json>',
		lint: {
			all: [
				//'static/!(autocomplete)**/*.js'
				'static/pera/*.js'
			]
		},

		watch: {
			files: '<config:lint.all>',
			tasks: 'lint requirejs'
		},

		clean: {
			folder: "static/compiled/css/"
		},

		requirejs: {
			compile: {
				options: config
			},
			admin: {
				options: {
					baseUrl: 'static/',
					paths: config.paths,
					shim: config.shim,
					name: 'main',
					//dir     : "./static/compiled/js/",
					out: 'static/pera/js/admin.js',
					preserveLicenseComments: false
				}
			},
			todomvc: {
				options:config_todomvc
			}
		}
	});

	// Alias requirejs to js
	//grunt.registerTask('js', 'requirejs:todomvc');
	grunt.config.set('requirejs.compile.options.baseUrl', 'static/');
	// Set the default grunt task, run when you type `grunt` with no arguments.
	grunt.registerTask('default', 'lint js css');

	// CSS task clears old unused css files from static/compiled/css then runs
	// compilation
	grunt.registerTask('css', 'clean compress');

	// Create a task to run django-compressor's compilation. `--force` is
	// because we want to do this regardless of DEBUG
	grunt.registerTask('compress',
		'Compresses CSS from django_compressor', function () {

			var done = this.async(),
				sync = spawn('./manage.py', [ 'compress', '--force']);

			sync.stdout.setEncoding('utf8');
			sync.stderr.setEncoding('utf8');
			sync.stdout.on('data', function (data) {
				grunt.log.write(data);
			});
			sync.stderr.on('data', function (data) {
				grunt.log.error(data);
			});

			sync.on('exit', function (code) {
				if (code !== 0) {
					done(false);
				} else {
					done();
				}
			});
		});

};

