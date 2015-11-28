module.exports = function(grunt) {
	grunt.initConfig({
		babel: {
			options: {
				presets: ['react']
			},
			react: {
				files: [{
					expand: true,
					cwd: 'statics/jsx',
					src: [
						'./*.jsx'
					],
					dest: 'statics/js/components',
					ext: '.js'
				}]
			}
		},
		less: {
			style: {
				files: {'statics/css/style.css': 'statics/less/style.less'}
			}
		},
		watch: {
			react: {
				files: 'statics/jsx/*.jsx',
				tasks: 'babel',
				options: {
					debounceDelay: 100
				}
			},
			less: {
				files: 'statics/less/*.less',
				tasks: 'less',
				options: {
					debounceDelay: 100
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('default', ['watch']);
};