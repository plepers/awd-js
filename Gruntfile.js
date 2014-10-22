'use strict';

module.exports = function(grunt) {


  // These plugins provide necessary tasks.
  require("load-grunt-tasks")(grunt);


  // Project configuration.
  grunt.initConfig({


    nodeunit: {
      options:{
        stack : true
      },
      files: ['test/**/*_test.js'],
    },

    browserify: {
      lib: {
        files: {
          'lib/awd.js': ['src/index.js']
        }
      },
      test: {
        files: {
          'tmp/tests.js': ['test/**/*.js'],
        }
      }

    },

    mocha : {
    },

    mochaTest : {
      test:{
        src:['tmp/tests.js']
      },
      node:{
        src:['test/*_test.js']
      }
    },


    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['src/**/*.js']
      },
    },


    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },


    karma: {
      dev: {
        configFile: 'karma.conf.js',
        background: true,
        browsers: ['Chrome']
      },
      travis: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },



    copy : {
      dev: {
        expand: true,
        flatten : true,
        src: '../polys-js/*',
        dest: 'node_modules/polys/',
      },
    }


  });




  // Default task.
  grunt.registerTask('default', [ 'jshint', 'browserify', 'mochaTest:node']);

};
