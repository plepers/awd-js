'use strict';

process.env["NODE_PATH"] = 'lib';

module.exports = function(grunt) {


  // These plugins provide necessary tasks.
  require("load-grunt-tasks")(grunt);
  require( './utils/makeIndex')( grunt );



  // Project configuration.
  grunt.initConfig({
    env: {
        NODE_PATH: 'lib'

    },

    nodeunit: {
      options:{
        stack : true
      },
      files: ['test/**/*_test.js'],
    },

    makeindex : {
      libawd : {
        options : {
          moduleNs : "awdjs",
          output : '.tmp/index.js',
          basedir : './src'
        },
        files: {
          src : ['src/**/*.js']
        }
      },
      extpil : {
        options : {
          moduleNs : "extpil",
          output : '.tmp/extpil.js',
          basedir : './extensions'
        },
        files: {
          src : ['extensions/pil/**/*.js']
        }
      }
    },


    browserify: {
      libawd: {
        options: {
          browserifyOptions: {
            node : true,
            paths:[ './src' ],
            standalone : 'libawd',
          }
        },
        files: {
          'lib/libawd.js': ['.tmp/index.js']
        }
      },
      extpil: {
        options: {
          external : ['libawd'],
          browserifyOptions: {
            node : true,
            paths:[ './extensions' ],
            standalone : 'extpil'
            //bundleExternal : false
          }
        },
        files: {
          'lib/extpil.js': ['.tmp/extpil.js']
        }
      },
      test: {
        options: {
          browserifyOptions: {
            node : true,
            paths:[ './lib', './src', './extensions' ],
            standalone : 'libtest'
          }
        },
        files: {
          'tmp/tests.js': ['test/**/*.js'],
        }
      }

    },

    copy: {
      nodelibs: {
        files: [
          {expand: true, src: ['lib/*'], dest: 'node_modules/', filter: 'isFile'},
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

    'browserify:libawd',
    'browserify:extpil',

    'copy:nodelibs',

    'browserify:test',
    'mochaTest:node'
  ]);

};
