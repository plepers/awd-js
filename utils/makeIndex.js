/*
 */

'use strict';

module.exports = function(grunt) {

  var path = require( 'path' );
  var fs = require( 'fs' );


  var template = grunt.file.read( './utils/index.tpl' );

  grunt.registerMultiTask('makeindex', 'Create index.js', function() {

    var options = this.options({
      moduleNs :"",
      output: 'src/index.js',
      basedir : ''
    });

    var tpl_deps = [];
    var tpl_args = [];
    var tpl_imports = [];
    var tpl_members = [];


    // Iterate over all src-dest file pairs.
    this.files.forEach(function(f) {
      f.src.filter(function(filepath) {


        var dir = path.dirname( filepath );
        dir = path.relative( 'src/', dir );

        var moduleName = path.basename( filepath, '.js' );
        var modulePath = path.posix.join( options.basedir, dir, moduleName );
        modulePath = modulePath.replace( /\\/g, '/' );

        if( moduleName != "index" ) {

          tpl_deps.push( "'"+modulePath+"'" );
          tpl_args.push( moduleName );
          tpl_imports.push( 'var '+ moduleName + " = require( '" + modulePath +"' );")
          tpl_members.push( moduleName + " : " + moduleName );
        }
      });

    });

    var datas = {data:{
      tpl_deps    : tpl_deps   .join( ',\n    ' ),
      tpl_args    : tpl_args   .join( ',\n    ' ),
      tpl_imports : tpl_imports.join( '\n  ' ),
      tpl_members : tpl_members.join( ',\n    ' ),
      moduleNs    : options.moduleNs
    }};

    var content = grunt.template.process( template, datas );

    grunt.file.write( options.output, content );
  });

};