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
      extstd : {
        options : {
          moduleNs : "extstd",
          output : '.tmp/extstd.js',
          basedir : './extensions'
        },
        files: {
          src : ['extensions/std/**/*.js']
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
      },
      extoptx : {
        options : {
          moduleNs : "extoptx",
          output : '.tmp/extoptx.js',
          basedir : './extensions'
        },
        files: {
          src : ['extensions/optx/**/*.js']
        }
      }
    },


    browserify: {

      libawd: genBrowserify(
        'libawd',
        []
      ),

      libawd_test: genBrowserify(
        'libawd',
        [],
        true
      ),

      extstd: genBrowserify(
        'extstd',
        ['libawd']
      ),

      extstd_test: genBrowserify(
        'extstd',
        ['libawd'],
        true
      ),

      extpil: genBrowserify(
        'extpil',
        ['libawd']
      ),

      extpil_test: genBrowserify(
        'extpil',
        ['libawd'],
        true
      ),

      extoptx: genBrowserify(
        'extoptx',
        ['libawd']
      ),

      extoptx_test: genBrowserify(
        'extoptx',
        ['libawd'],
        true
      ),

      test: {
        options: {
          external : ['libawd', 'extstd', 'extpil', 'extoptx' ],
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
          beautify: false
        },
        files: {
          'lib/libawd_readonly.min.js': ['tmp/libawd.js'],
          'lib/extstd_readonly.min.js': ['tmp/extstd.js'],
          'lib/extpil_readonly.min.js': ['tmp/extpil.js'],
          'lib/extoptx_readonly.min.js': ['tmp/extoptx.js'],
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
          beautify: false
        },
        files: {
          'lib/libawd.min.js': ['tmp/libawd.js'],
          'lib/extstd.min.js': ['tmp/extstd.js'],
          'lib/extpil.min.js': ['tmp/extpil.js'],
          'lib/extoptx.min.js': ['tmp/extoptx.js'],
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
          'lib/extstd.js': ['tmp/extstd.js'],
          'lib/extpil.js': ['tmp/extpil.js'],
          'lib/extoptx.js': ['tmp/extoptx.js'],
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
