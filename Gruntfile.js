'use strict';

process.env["NODE_PATH"] = 'lib';

module.exports = function(grunt) {


  // These plugins provide necessary tasks.
  require("load-grunt-tasks")(grunt);
  require( './utils/makeIndex')( grunt );

  var genBrowserify = require ( './utils/gen-browserify');



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
          output : '.tmp/libawd.js',
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

      libawd: genBrowserify(
        'libawd',
        []
      ),

      extpil: genBrowserify(
        'extpil',
        ['libawd']
      ),

      libawd_test: genBrowserify(
        'libawd',
        [],
        true
      ),

      extpil_test: genBrowserify(
        'extpil',
        ['libawd'],
        true
      ),

      test: {
        options: {
          external : ['libawd', 'extpil'],
        },
        files: {
          'tmp/tests.js': ['test/**/*.js'],
        }
      }

    },

    uglify: {
      libs_readonly: {
        options: {
          mangle: {
            except: ['require', 'module', 'exports']
          },
          compress: {
            global_defs: {
              "CONFIG_WRITE": false
            },
            dead_code: true
          },
          beautify: true
        },
        files: {
          'lib/libawd_readonly.min.js': ['tmp/libawd.js'],
          'lib/extpil_readonly.min.js': ['tmp/extpil.js'],
        }
      },
      libs_min: {
        options: {
          mangle: {
            except: ['require', 'module', 'exports']
          },
          compress: {
            global_defs: {
              "CONFIG_WRITE": true
            },
            dead_code: true
          },
          beautify: true
        },
        files: {
          'lib/libawd.min.js': ['tmp/libawd.js'],
          'lib/extpil.min.js': ['tmp/extpil.js'],
        }
      },
      libs: {
        options: {
          mangle: {
            except: ['require', 'module', 'exports']
          },
          compress: {
            global_defs: {
              "CONFIG_WRITE": true
            },
            dead_code: true
          },
          beautify: true
        },
        files: {
          'lib/libawd.js': ['tmp/libawd.js'],
          'lib/extpil.js': ['tmp/extpil.js'],
        }
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
    'uglify',

    'copy:nodelibs',

    'browserify:test',
    'mochaTest:node'
  ]);

};
