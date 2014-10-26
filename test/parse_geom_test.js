'use strict';

var Awd     = require('../src/awd'),
    Consts  = require( '../src/consts'),
    fs      = require( 'fs' ),
    expect  = require('expect.js'),
    butils  = require( './utils/buffer_utils');


describe( "Parse geometry", function(){


  var awdBuf;

  var awd;

  before(function( done ){

    fs.readFile('./test/samples/fish.awd', function (err, data) {
      if (err) {
        done( err );
      }

      awdBuf = butils.toArrayBuffer( data );
      awd = new Awd( );
      awd.parse( awdBuf );

      done();
    });

  });





  it( "should have one geom block", function(){

    var geoms = awd.getDatasByType( Consts.GEOMETRY );
    expect( geoms.length ).to.be.equal( 1 );

  });

  it( "should have one sub geom", function(){

    var geom = awd.getDatasByType( Consts.GEOMETRY )[0];
    expect( geom.subGeoms.length ).to.be.equal( 1 );

  });


  it( "should have 5 buffers", function(){

    var subgeom = awd.getDatasByType( Consts.GEOMETRY )[0].subGeoms[0];
    expect( subgeom.buffers.length ).to.be.equal( 5 );

  });

});

