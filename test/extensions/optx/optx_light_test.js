'use strict';


var awdlib = require('libawd' );
var optx = require('extoptx' );

var Awd = awdlib.awd,
    Consts = awdlib.consts,
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    utils  = require('./optx_utils'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Mesh = optx.Mesh,
    Light = optx.Light,
    Ext = optx.ext;


function numEqals( n1, n2 ){
  expect( Math.abs(n1 - n2) < 0.00001 ).to.be.equal( true );
}


function createLightA(){
  var light = new Light()
  light.name = 'lightA'

  light.matrix.data[0] = 2.0;
  light.matrix.data[5] = 2.0;
  light.matrix.data[10] = 2.0;

  light.pivot.x = 10;
  light.pivot.y = 15;
  light.pivot.z = 20;

  light.color         = [.5, .2, .2]
  light.radius        = 50
  light.falloffCurve  = 1.5
  light.spotAngle     = 30
  light.spotShapness  = .2
  light.shadow        = true


  var mesh = utils.createMesh();
  mesh.addChild( light );


  return light;

}



describe( "optx Light test", function(){



  var awdBuf, awd;

  beforeEach(function(  ){

    awd = new Awd( );
    awd.addExtension( Ext.getExtension() );

  });

  it( "write new Light A", function(){

    var light = createLightA()
    awd.addElement( light );
    var buf = awd.write();
  });


  it( "write and read back new light A", function(){

    var light = createLightA()
    awd.addElement( light );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var lights = nawd.getDatasByType( Ext.OPTX_LIGHT, Ext.URI );

    expect( lights.length ).to.be.equal( 1 );
    var light = lights[0];

    expect( light.name ).to.be('lightA')

    expect( light.shadow ).to.be( true );

    numEqals( light.matrix.data[0]  , 2.0 );
    numEqals( light.matrix.data[5]  , 2.0 );
    numEqals( light.matrix.data[10] , 2.0 );

    numEqals( light.color[0]  , .5 );
    numEqals( light.color[1]  , .2 );
    numEqals( light.color[2]  , .2 );


    numEqals( light.radius        , 50 );
    numEqals( light.falloffCurve  , 1.5 );
    numEqals( light.spotAngle     , 30 );
    numEqals( light.spotShapness  , .2 );

    expect(   light.shadow        ).to.be( true );



    expect( light.parent ).to.be.ok();
    expect( light.parent.name ).to.be.equal('mesh');




  });


});

