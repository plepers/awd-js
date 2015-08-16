'use strict';

module.exports = function(grunt) {


  // These plugins provide necessary tasks.
  require("load-grunt-tasks")(grunt);
  require( './utils/makeIndex')( grunt );


  // Project configuration.
  grunt.initConfig({


    nodeunit: {
      options:{
        stack : true
      },
      files: ['test/**/*_test.js'],
    },

    makeindex : {
      options : {
        moduleNs : "awdjs",
        output : '.tmp/index.js'
      },
      files: ['src/**/*.js']
    },

    browserify: {
      options: {
        browserifyOptions: {
          paths:[ './lib', './src', './extensions' ]
        }
      },
      lib: {
        files: {
          'lib/libawd.js': ['.tmp/index.js']
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

    connect: {
      options: {
        keepalive : true,
        port: 9000,
        hostname: "0.0.0.0",
        livereload: 35729
      },
      test: {
        options: {
          base: [
            "test",
            "."
          ]
        }
      }
    }



  });




  // Default task.
  grunt.registerTask('default', [
    'jshint',
    'makeindex',
    'browserify',
    'mochaTest:test'
  ]);

};
