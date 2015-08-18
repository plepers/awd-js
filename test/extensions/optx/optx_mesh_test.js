'use strict';


var awdlib = require('libawd' );
var optx = require('extoptx' );

var Awd = awdlib.awd,
    Consts = awdlib.consts,
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Mesh = optx.Mesh,
    Ext = optx.ext;




function createOptxMeshA(){
  var mesh = new Mesh()
  mesh.name = 'meshA'

  mesh.matrix.data[0] = 2.0;
  mesh.matrix.data[5] = 2.0;
  mesh.matrix.data[10] = 2.0;

  mesh.pivot.x = 10;
  mesh.pivot.y = 15;
  mesh.pivot.z = 20;

  mesh.geometry = null;

  mesh.setCullBackFace( false );
  mesh.setCastShadows( true );

  var sub;

  sub = new Mesh.SubMesh();
  sub.firstIndex     = 10;
  sub.indexCount     = 20;
  sub.firstWireIndex = 15;
  sub.wireIndexCount = 30;
  mesh.submeshes.push( sub );


  sub = new Mesh.SubMesh();
  sub.firstIndex     = 100;
  sub.indexCount     = 20 ;
  sub.firstWireIndex = 150;
  sub.wireIndexCount = 30 ;

  mesh.submeshes.push( sub );


  return mesh;

}



describe( "optx Mesh test", function(){



  var awdBuf, awd;

  beforeEach(function(  ){

    awd = new Awd( );
    awd.addExtension( Ext.getExtension() );

  });

  it( "write new mesh A", function(){

    var mesh = createOptxMeshA()
    awd.addElement( mesh );
    var buf = awd.write();
  });


  it( "write and read back new mesh A", function(){

    var mesh = createOptxMeshA()
    awd.addElement( mesh );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var meshes = nawd.getDatasByType( Ext.OPTX_MESH, Ext.URI );

    expect( meshes.length ).to.be.equal( 1 );
    var mesh = meshes[0];

    expect( mesh.name ).to.be('meshA')

    console.log( mesh.getCullBackFace() )
    expect( mesh.getCullBackFace() ).to.be( false );
    expect( mesh.getCastShadows() ).to.be( true );

    expect(   mesh.matrix.data[0]  ).to.be( 2.0 );
    expect(   mesh.matrix.data[5]  ).to.be( 2.0 );
    expect(   mesh.matrix.data[10] ).to.be( 2.0 );

    expect( mesh.submeshes.length ).to.be.equal( 2 );

    var sub = mesh.submeshes[0]

    expect( sub.firstIndex     ).to.be.equal( 10 );
    expect( sub.indexCount     ).to.be.equal( 20 );
    expect( sub.firstWireIndex ).to.be.equal( 15 );
    expect( sub.wireIndexCount ).to.be.equal( 30 );

    sub = mesh.submeshes[1]

    expect( sub.firstIndex     ).to.be.equal( 100 );
    expect( sub.indexCount     ).to.be.equal( 20  );
    expect( sub.firstWireIndex ).to.be.equal( 150 );
    expect( sub.wireIndexCount ).to.be.equal( 30  );


  });


});

