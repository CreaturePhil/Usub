module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      files: ['*.js', 'app/**/*.js', 'config/*.js', 'test/*.js', 'public/js/*.js'],
      options: {
        jshintrc: true
      }
    },

    concat: {
      js: {
        files: {
          'public/assets/js/main.js': [ 
            'public/bower_components/bootstrap/dist/js/bootstrap.js',
            'public/bower_components/bootstrap-notify/js/bootstrap-notify.js',
            'public/bower_components/instantclick/instantclick.js',
            'public/js/scripts.js'],
          'public/assets/js/scripts.js': [
            'public/js/settings.js', 
            'public/js/subscriptions.js',
            'public/js/search.js']
        }
      },
      css: {
        files: {
          'public/assets/css/main.css': [
            'public/bower_components/bootstrap/dist/css/bootstrap.css',
            'public/bower_components/bootstrap-notify/css/bootstrap-notify.css',
            'public/bower_components/fontawesome/css/font-awesome.css',
            'public/bower_components/bootswatch/simplex/bootstrap.min.css',
            'public/css/styles.css' ]
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'public/assets/js/main.min.js': ['public/assets/js/main.js'],
          'public/assets/js/scripts.min.js': ['public/assets/js/scripts.js']
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          'public/assets/css/main.min.css': ['public/assets/css/main.css']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('build', ['concat', 'uglify', 'cssmin']);

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);

};
