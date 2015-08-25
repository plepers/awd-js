'use strict';


var awdlib = require('awdlib' );
var optx = require('awdlib_optx' )(awdlib);

var Awd = awdlib.awd,
    Consts = awdlib.consts,
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    OptxGeometry = optx.Geometry,
    Ext = optx.ext;




function createOptxGeomA(){
  var geom = new OptxGeometry()
  geom.name = 'geomA'

  var vbuffer = new OptxGeometry.VertexBuffer()
  var stride = 0;

  var aPos = new OptxGeometry.VertexAttibute()
  aPos.name     = 'aPosition';
  aPos.numElems = 3;
  aPos.glType   = OptxGeometry.types.FLOAT;
  stride += aPos.getBytesSize()

  var aUvs = new OptxGeometry.VertexAttibute()
  aUvs.name     = 'aTexCoord0';
  aUvs.numElems = 2;
  aUvs.glType   = OptxGeometry.types.FLOAT;
  stride += aUvs.getBytesSize()

  vbuffer.attributes.push( aPos )
  vbuffer.attributes.push( aUvs )


  vbuffer.data = new Int8Array( stride * 4 ); //4 vertices
  var fArray = new Float32Array( vbuffer.data.buffer )
  fArray.set( [
    0,  0,  0, 0, 0,
    10, 0,  0, 1, 0,
    10, 10, 0, 1, 1,
    0,  10, 0, 0, 1
  ] )

  geom.vertexBuffers.push( vbuffer )


  var iBuffer = new OptxGeometry.IndexBuffer()
  iBuffer.glType = OptxGeometry.types.UNSIGNED_SHORT;
  iBuffer.usage = 1;

  iBuffer.data = new Uint16Array( [
    0, 1, 2,
    0, 2, 3
  ] )

  geom.indexBuffers.push( iBuffer )

  return geom;

}



function createOptxGeomB(){
  var geom = new OptxGeometry()
  geom.name = 'geomB'

  var vbuffer = new OptxGeometry.VertexBuffer()
  var stride = 0;

  var aPos = new OptxGeometry.VertexAttibute()
  aPos.name     = 'aPosition';
  aPos.numElems = 3;
  aPos.glType   = OptxGeometry.types.FLOAT;
  stride += aPos.getBytesSize()


  vbuffer.attributes.push( aPos )

  vbuffer.data = new Int8Array( stride * 40000 ); //4 vertices

  geom.vertexBuffers.push( vbuffer )


  var iBuffer = new OptxGeometry.IndexBuffer()
  iBuffer.glType = OptxGeometry.types.UNSIGNED_SHORT;
  iBuffer.usage = 1;

  iBuffer.data = new Uint16Array( [
    0, 1, 2,
    0, 2, 3
  ] )

  geom.indexBuffers.push( iBuffer )

  return geom;

}



describe( "optx geometries test", function(){



  var awdBuf, awd;

  beforeEach(function(  ){

    awd = new Awd( );
    awd.addExtension( Ext.getExtension() );

  });

  it( "write new geom A", function(){

    var geom = createOptxGeomA()
    awd.addElement( geom );
    var buf = awd.write();

  });


  it( "write and read back new geom A", function(){

    var geom;
    geom = createOptxGeomA()
    awd.addElement( geom );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var geoms = nawd.getDatasByType( Ext.OPTX_GEOM, Ext.URI );

    expect( geoms.length ).to.be.equal( 1 );
    var geom = geoms[0];

    expect( geom.name ).to.be('geomA')

    expect( geom.vertexBuffers.length ).to.be.equal( 1 );
    expect( geom.indexBuffers.length ).to.be.equal( 1 );

    var vbuff = geom.vertexBuffers[0]

    expect( vbuff.attributes.length ).to.be.equal( 2 );

    expect( vbuff.attributes[0].name     ).to.be( 'aPosition' );
    expect( vbuff.attributes[0].numElems ).to.be.equal( 3 );
    expect( vbuff.attributes[0].glType   ).to.be.equal( OptxGeometry.types.FLOAT );
    expect( vbuff.attributes[0].flags    ).to.be.equal( 0 );


    expect( vbuff.attributes[1].name     ).to.be( 'aTexCoord0' );
    expect( vbuff.attributes[1].numElems ).to.be.equal( 2 );
    expect( vbuff.attributes[1].glType   ).to.be.equal( OptxGeometry.types.FLOAT );
    expect( vbuff.attributes[1].flags    ).to.be.equal( 0 );

    compArray( vbuff.data, new Float32Array([
      0,  0,  0, 0, 0,
      10, 0,  0, 1, 0,
      10, 10, 0, 1, 1,
      0,  10, 0, 0, 1
    ] ) )

  });


  it( "write and read back heavy geom", function(){

    var geom;
    geom = createOptxGeomB()
    awd.addElement( geom );
    geom = createOptxGeomB()
    awd.addElement( geom );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var geoms = nawd.getDatasByType( Ext.OPTX_GEOM, Ext.URI );

    expect( geoms.length ).to.be.equal( 2 );
    var geom = geoms[0];

    expect( geom.name ).to.be('geomB')

    expect( geom.vertexBuffers.length ).to.be.equal( 1 );
    expect( geom.indexBuffers.length ).to.be.equal( 1 );

    var vbuff = geom.vertexBuffers[0]

    expect( vbuff.attributes.length ).to.be.equal( 1 );

    expect( vbuff.attributes[0].name     ).to.be( 'aPosition' );
    expect( vbuff.attributes[0].numElems ).to.be.equal( 3 );
    expect( vbuff.attributes[0].glType   ).to.be.equal( OptxGeometry.types.FLOAT );
    expect( vbuff.attributes[0].flags    ).to.be.equal( 0 );


    expect( vbuff.data.length ).to.be( 40000 * 12 );

  });


});

