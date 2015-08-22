'use strict';


var awdlib = require('libawd' );
var optx = require('extoptx' );
var utils = require('./optx_utils' );

var Awd = awdlib.awd,
    Consts = awdlib.consts,
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Camera = optx.Camera,
    Ext = optx.ext;


function numEqals( n1, n2 ){
  expect( Math.abs(n1 - n2) < 0.00001 ).to.be.equal( true );
}


function createPers(){
  var camera = new Camera()
  camera.name = 'cameraPers'

  camera.matrix.data[0] = 2.0;
  camera.matrix.data[5] = 2.0;
  camera.matrix.data[10] = 2.0;

  camera.pivot.x = 10;
  camera.pivot.y = 15;
  camera.pivot.z = 20;

  camera.makePerspective( 91, .3, 20000 );

  var parent = utils.createMesh();
  parent.addChild( camera );

  return camera;

}


function createOrtho(){
  var camera = new Camera()
  camera.name = 'cameraOrtho'

  camera.matrix.data[0] = 2.0;
  camera.matrix.data[5] = 2.0;
  camera.matrix.data[10] = 2.0;

  camera.pivot.x = 10;
  camera.pivot.y = 15;
  camera.pivot.z = 20;

  camera.makeOrtho( -2, 2.5, -1, 1.5, 3, 6 );

  return camera;

}


describe( "optx Camera test", function(){



  var awdBuf, awd;

  beforeEach(function(  ){

    awd = new Awd( );
    awd.addExtension( Ext.getExtension() );

  });

  it( "write new pers Camera ", function(){

    var cam = createPers()
    awd.addElement( cam );
    var buf = awd.write();
  });


  it( "write and read back pers Camera", function(){

    var cam = createPers()
    awd.addElement( cam );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var cams = nawd.getDatasByType( Ext.OPTX_CAMERA, Ext.URI );

    expect( cams.length ).to.be.equal( 1 );
    var light = cams[0];

    expect( cam.name ).to.be('cameraPers')

    numEqals( cam.matrix.data[0]  , 2.0 );
    numEqals( cam.matrix.data[5]  , 2.0 );
    numEqals( cam.matrix.data[10] , 2.0 );

    expect( cam.lensType ).to.be.equal( 0 );

    numEqals( cam.near , .3 );
    numEqals( cam.far  , 20000 );
    numEqals( cam.fov  , 91 );


    expect( cam.parent ).to.be.ok();
    expect( cam.parent.name ).to.be.equal('mesh');

  });



  it( "write new ortho Camera ", function(){

    var cam = createOrtho()
    awd.addElement( cam );
    var buf = awd.write();
  });


  it( "write and read back ortho Camera", function(){

    var cam = createOrtho()
    awd.addElement( cam );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var cams = nawd.getDatasByType( Ext.OPTX_CAMERA, Ext.URI );

    expect( cams.length ).to.be.equal( 1 );
    var light = cams[0];

    expect( cam.name ).to.be('cameraOrtho')

    numEqals( cam.matrix.data[0]  , 2.0 );
    numEqals( cam.matrix.data[5]  , 2.0 );
    numEqals( cam.matrix.data[10] , 2.0 );

    expect( cam.lensType ).to.be.equal( 1 );

    numEqals( cam.near , 3 );
    numEqals( cam.far  , 6 );
    numEqals( cam.minX  , -2  );
    numEqals( cam.maxX  , 2.5 );
    numEqals( cam.minY  , -1  );
    numEqals( cam.maxY  , 1.5 );


    expect( cam.parent ).not.to.be.ok();

  });


});

