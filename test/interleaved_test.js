'use strict';

var Awd = require('../src/awd'),
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( './utils/buffer_utils'),
    Interleaved = require( '../src/ext/InterleavedGeometry'),
    facto = require( '../src/ext/factory'),
    Ext = require( '../src/ext/ext'),
    Consts = require( '../src/consts');


describe( "interleaved geometries test", function(){


  var awdBuf;

  var awd;

  before(function( done ){

    fs.readFile('./test/samples/fish.awd', function (err, data) {
      if (err) {
        done( err );
      }

      awdBuf = butils.toArrayBuffer( data );
      awd = new Awd( );
      awd.addFactory( Ext.NS, facto );

      awd.parse( awdBuf );

      done();
    });

  });



  it( "convert geom to interleaved", function(){


    var geom = awd.getDatasByType( Consts.GEOMETRY )[0];

    var ig = new Interleaved();
    ig.fromGeometry( geom );

    expect( ig.subGeoms.length ).to.be.equal( 1 );
    expect( ig.subGeoms[0].buffers.length ).to.be.equal( 2 );
    expect( ig.subGeoms[0].buffers.length ).to.be.equal( 2 );


  });

  it( "should write back interleaved", function(){


    var geom = awd.getDatasByType( Consts.GEOMETRY )[0];

    var ig = new Interleaved();
    ig.fromGeometry( geom );

    geom.block.data = ig;

    var buf = awd.write();

    fs.writeFile( './test/output/test_interleaved.awd', butils.fromArrayBuffer( buf ), function (err) {
      if (err) throw err;
    } );


    var re = new Awd( );
    re.addFactory( Ext.NS, facto );
    re.parse( buf );

    var geoms = re.getDatasByType( Ext.INTERLEAVED_GEOM, Ext.NS );


    expect( geoms.length ).to.be.equal( 1 );
    expect( geoms[0].subGeoms.length ).to.be.equal( 1 );
    expect( geoms[0].subGeoms[0].buffers.length ).to.be.equal( 2 );
  });

});

