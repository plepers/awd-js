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
        output : '.tmp/awdlib_'+ext+'.js',
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
      awdlib : {
        options : {
          moduleNs : "awdjs",
          output : '.tmp/awdlib.js',
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

      awdlib: genBrowserify.main(
        'awdlib',
        []
      ),

      awdlib_test: genBrowserify.main(
        'awdlib',
        [],
        true
      ),

      extstd: genBrowserify.ext(
        'std',
        ['awdlib']
      ),

      extstd_test: genBrowserify.ext(
        'std',
        ['awdlib'],
        true
      ),

      extpil: genBrowserify.ext(
        'pil',
        ['awdlib']
      ),

      extpil_test: genBrowserify.ext(
        'pil',
        ['awdlib'],
        true
      ),

      extoptx: genBrowserify.ext(
        'optx',
        ['awdlib']
      ),

      extoptx_test: genBrowserify.ext(
        'optx',
        ['awdlib'],
        true
      ),

      test: {
        options: {
          external : ['awdlib', 'awdlib_std', 'awdlib_pil', 'awdlib_optx' ],
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
          'lib/awdlib_readonly.js': ['tmp/awdlib.js'],
          'lib/awdlib_std_readonly.js': ['tmp/awdlib_std.js'],
          'lib/awdlib_pil_readonly.js': ['tmp/awdlib_pil.js'],
          'lib/awdlib_optx_readonly.js': ['tmp/awdlib_optx.js'],
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
          'lib/awdlib.js': ['tmp/awdlib.js'],
          'lib/awdlib_std.js': ['tmp/awdlib_std.js'],
          'lib/awdlib_pil.js': ['tmp/awdlib_pil.js'],
          'lib/awdlib_optx.js': ['tmp/awdlib_optx.js'],
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
    'makeindex',
    'browserify',
    'uglify',
  ]);

  grunt.registerTask('test', [
    'copy:nodelibs',
    'browserify:test',
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
