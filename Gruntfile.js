'use strict';

process.env["NODE_PATH"] = 'lib';

module.exports = function(grunt) {


  // These plugins provide necessary tasks.
  require("load-grunt-tasks")(grunt);
  require( './utils/makeIndex')( grunt );





  // Project configuration.
  var GConfig = {
    env: {
        NODE_PATH: 'lib'

    },

    nodeunit: {
      options:{
        stack : true
      },
      files: ['test/**/*_test.js'],
    },



    uglify: {
      libs_readonly: {
        options: {
          mangle: false,
          compress: {
            global_defs: {
              "CONFIG_WRITE": false
            },
            dead_code: true
          },
          beautify: true
        },
        files: [{
          expand: true,
          src: 'src/**/*.js',
          dest: 'readonly/',
          cwd: '.',
          rename: function (dst, src) {
            return dst+ '/' + src.replace('src/', '');
          }
        }]
      },

      libs: {
        options: {
          mangle: false,
          compress: {
            global_defs: {
              "CONFIG_WRITE": true
            },
            dead_code: true
          },
          beautify: true
        },
        files: [{
          expand: true,
          src: 'src/**/*.js',
          dest: 'lib/',
          cwd: '.',
          rename: function (dst, src) {
            return dst+ '/' + src.replace('src/', '');
          }
        }]
      },
    },

    copy: {
      nodelibs: {
        files: [
          {expand: true, cwd: 'lib/', src: ['*'], dest: 'node_modules/', filter: 'isFile'},
        ],
      },
    },

    mocha : {
    },

    mochaTest : {
      test:{
        src:['tmp/tests.js']
      },
      node:{
        src:['test/**/*_test.js']
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
        src: ['src/**/*.js', 'extensions/**/*.js']
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
      karma: {
        files: ['src/**/*.js', 'test/**/*.js'],
        tasks: [ 'karma:dev:run']
      }
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

  };

  grunt.initConfig( GConfig );




  grunt.registerTask('build', [
    'jshint',
    'uglify',
  ]);

  grunt.registerTask('test', [
    'build',
    'mochaTest:node'
  ]);


  grunt.registerTask('dev', [
    'karma:dev:start',
    'watch:karma'
  ]);
      // Default task.
  grunt.registerTask('travis', [
    'build',
    'karma:travis'
  ]);

    // Default task.
  grunt.registerTask('default', [
    'build',
    'test'
  ]);


};
