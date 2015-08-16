'use strict';

var Awd     = require('../src/awd'),
    fs      =  require( 'fs' ),
    expect  = require('expect.js'),
    butils  = require( './utils/buffer_utils');


describe( "parser test", function(){


  var polarBear;

  beforeEach(function( done ){

    fs.readFile('./test/samples/apple.awd', function (err, data) {
      if (err) {
        done( err );
      }

      polarBear = butils.toArrayBuffer( data );
      done();
    });

  });

  afterEach(function(){

  });



  it( "awd load polar bear", function(){


    var awd = new Awd( );
    awd.parse( polarBear );

    var buf = awd.write();

    fs.writeFile( './test/output/test.awd', butils.fromArrayBuffer( buf ), function (err) {
      if (err) throw err;
    } );


    var re = new Awd( );
    re.parse( buf );

  });




  it( "read all", function( done ){

    var files = [
      "apple.awd",
      "fish_c4d.awd",
      "fish_ab.awd",
      "haikus.awd"
      // "ile.awd"
    ];

    var numFiles = files.length;

    for (var i = 0, l = files.length; i < l; i++) {
      var file = files[i];

      (function( file ){


        fs.readFile('./test/samples/'+file, function (err, data) {
          if (err) {
            done( err );
          }

          var awdBuffer = butils.toArrayBuffer( data );
          var awd = new Awd( );
          console.log( "parse", file );
          awd.parse( awdBuffer );
          numFiles--;
          console.log( "read ", file, awd._elements.length );
          if( numFiles === 0 ) {
            done();
          }
        });
      }( file ));
    }

  });



});

