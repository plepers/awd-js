'use strict';

var Awd = require('../src/awd'),
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( './utils/buffer_utils');


describe( "parser test", function(){


  var polarBear;

  beforeEach(function( done ){

    fs.readFile('./test/samples/PolarBear.awd', function (err, data) {
      if (err) {
        done( err );
      }

      polarBear = butils.toArrayBuffer( data );
      done();
    });

  });

  afterEach(function(){

  });



  it( "awd load ploar bear", function(){


    var awd = new Awd( );
    awd.parse( polarBear );

  });
});

