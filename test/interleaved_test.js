'use strict';


var Awd = require('../lib/awd'),
    Consts = require('../lib/consts'),
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( './utils/buffer_utils'),
    Interleaved   = require('../lib/pil/InterleavedGeometry'),
    toInterleaved = require('../lib/tools/toInterleaved');

var Ext = require('../lib/pil/ext');
var StdExt = require('../lib/std/ext');


describe( "interleaved geometries test", function(){


  var awdBuf;

  var awd;

  before(function( done ){

    fs.readFile('./test/samples/fish_c4d.awd.gz', function (err, data) {
      if (err) {
        done( err );
        return;
      }

      awdBuf = butils.toArrayBuffer( data );
      awd = new Awd( );

      awd.addExtension( StdExt.getExtension() );
      awd.addExtension( Ext.getExtension() );
      console.log( awdBuf )
      awd.parse( awdBuf );

      done();
    });

  });



  it( "convert geom to interleaved", function(){

    var geom = awd.getDatasByType( Consts.GEOMETRY )[0];

    // var ig = new Interleaved();
    // ig.fromGeometry( geom );
    var ig = toInterleaved( geom );

    expect( ig.subGeoms.length ).to.be.equal( 1 );
    expect( ig.subGeoms[0].buffers.length ).to.be.equal( 2 );
    expect( ig.subGeoms[0].buffers.length ).to.be.equal( 2 );
    // console.log( ig.subGeoms[0].buffers[0] )
    // console.log( ig.subGeoms[0].buffers[1] )
    // console.log( ig.subGeoms[0].buffers[2] )

    // index
    
    // GL_ELEMENT_ARRAY_BUFFER
    expect( ig.subGeoms[0].buffers[0].buffertype ).to.be.equal( 34963 );
    
    // GL_ARRAY_BUFFER
    expect( ig.subGeoms[0].buffers[1].buffertype ).to.be.equal( 34962 );

  });

  it( "should write back interleaved", function(){


    var geom = awd.getDatasByType( Consts.GEOMETRY )[0];

    // var ig = new Interleaved();
    // ig.fromGeometry( geom );

    var ig = toInterleaved( geom );
    
    awd.removeElement( geom );
    awd.addElement( ig );

    var buf = awd.write();

    if( fs.writeFile ) {
      if( !fs.existsSync( './test/output/' ) )
        fs.mkdirSync( './test/output/' );

      fs.writeFile( './test/output/test_interleaved.awd', butils.fromArrayBuffer( buf ), function (err) {
        if (err) throw err;
      } );
    }


    var re = new Awd( );
    re.addExtension( StdExt.getExtension() );
    re.addExtension( Ext.getExtension() );
    re.parse( buf );

    var geoms = re.getDatasByType( Ext.INTERLEAVED_GEOM, Ext.URI );



    expect( geoms.length ).to.be.equal( 1 );
    expect( geoms[0].subGeoms.length ).to.be.equal( 1 );
    expect( geoms[0].subGeoms[0].buffers.length ).to.be.equal( 2 );
  });

});

