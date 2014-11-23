module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      files: ['*.js', 'app/**/*.js', 'config/*.js', 'test/*.js', 'public/js/scripts.js'],
      options: {
        jshintrc: true
      }
    },

    concat: {
      js: {
        files: {
          'public/js/main.js': [ 
            'public/bower_components/bootstrap/dist/js/bootstrap.js',
            'public/bower_components/instantclick/instantclick.js',
            'public/js/scripts.js']
        }
      },
      css: {
        files: {
          'public/css/main.css': [
            'public/bower_components/bootstrap/dist/css/bootstrap.css', 
            'public/bower_components/fontawesome/css/font-awesome.css', 
            'public/css/styles.css' ]
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'public/js/main.min.js': ['public/js/main.js']
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          'public/css/main.min.css': ['public/css/main.css']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);

};
