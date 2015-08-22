'use strict';

process.env["NODE_PATH"] = 'lib';

module.exports = function(grunt) {


  // These plugins provide necessary tasks.
  require("load-grunt-tasks")(grunt);
  require( './utils/makeIndex')( grunt );

  var genBrowserify = require ( './utils/gen-browserify');



  function makeExtIndex( ext ) {
    return {
      options : {
        moduleNs : ext,
        output : '.tmp/libawd_'+ext+'.js',
        basedir : './extensions'
      },
      files: {
        src : ['extensions/'+ext+'/**/*.js']
      }
    };
  }



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
      extstd :  makeExtIndex( 'std' ),
      extpil :  makeExtIndex( 'pil' ),
      extoptx : makeExtIndex( 'optx' ),
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
        'libawd_std',
        ['libawd']
      ),

      extstd_test: genBrowserify(
        'libawd_std',
        ['libawd'],
        true
      ),

      extpil: genBrowserify(
        'libawd_pil',
        ['libawd']
      ),

      extpil_test: genBrowserify(
        'libawd_pil',
        ['libawd'],
        true
      ),

      extoptx: genBrowserify(
        'libawd_optx',
        ['libawd']
      ),

      extoptx_test: genBrowserify(
        'libawd_optx',
        ['libawd'],
        true
      ),

      test: {
        options: {
          external : ['libawd', 'libawd_std', 'libawd_pil', 'libawd_optx' ],
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
          'lib/libawd_std_readonly.min.js': ['tmp/libawd_std.js'],
          'lib/libawd_pil_readonly.min.js': ['tmp/libawd_pil.js'],
          'lib/libawd_optx_readonly.min.js': ['tmp/libawd_optx.js'],
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
          'lib/libawd_std.min.js': ['tmp/libawd_std.js'],
          'lib/libawd_pil.min.js': ['tmp/libawd_pil.js'],
          'lib/libawd_optx.min.js': ['tmp/libawd_optx.js'],
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
          'lib/libawd_std.js': ['tmp/libawd_std.js'],
          'lib/libawd_pil.js': ['tmp/libawd_pil.js'],
          'lib/libawd_optx.js': ['tmp/libawd_optx.js'],
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

  };

  grunt.initConfig( GConfig );




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
