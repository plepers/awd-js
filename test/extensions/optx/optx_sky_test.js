'use strict';


var awdlib = require('awdlib' );
var optx = require('awdlib_optx' );

var Awd = awdlib.awd,
    Consts = awdlib.consts,
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    utils  = require('./optx_utils'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Texture = optx.Texture,
    Env = optx.Env,
    Sky = optx.Sky,
    Ext = optx.ext;


function numEqals( n1, n2 ){
  expect( Math.abs(n1 - n2) < 0.00001 ).to.be.equal( true );
}


function createTex() {
  var tex = new Texture()
  tex.name = 'externalTexture'
  tex.uri = 'http://test.com/tex/texture.jpg';
  return tex;
}

function createEnv(){
  var env = new Env()
  env.name = 'envA'
  env.brightness = .7;
  env.envMap = createTex();
  env.shCoefs = new Float32Array( 27 );

  return env;

}

function createSky() {
  var sky = new Sky()

  sky.env = createEnv();
  sky.name = 'sky0'

  sky.matrix.data[0]  = 3.0;
  sky.matrix.data[5]  = 3.0;
  sky.matrix.data[10] = 3.0;

  sky.brightness = .96;
  sky.useEnvmapMode()


  var mesh = utils.createMesh();
  mesh.addChild( sky );

  return sky;
}



describe( "optx Sky test", function(){



  var awdBuf, awd;

  beforeEach(function(  ){

    awd = new Awd( );
    awd.addExtension( Ext.getExtension() );

  });

  it( "write new Sky A", function(){

    var sky = createSky()
    awd.addElement( sky );
    var buf = awd.write();
  });


  it( "write and read back new sky A", function(){

    var sky = createSky()
    awd.addElement( sky );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var skys = nawd.getDatasByType( Ext.OPTX_SKY, Ext.URI );

    expect( skys.length ).to.be.equal( 1 );
    var nsky = skys[0];

    expect( nsky ).to.be.ok()
    expect( nsky.name ).to.be('sky0')


    numEqals( nsky.matrix.data[0]  , 3.0 );
    numEqals( nsky.matrix.data[5]  , 3.0 );
    numEqals( nsky.matrix.data[10] , 3.0 );


    expect(   nsky.env   ).to.be.ok();
    expect(   nsky.env.name   ).to.be.equal( 'envA'  );
    numEqals( nsky.brightness        , .96 );
    expect(   nsky.skyType   ).to.be.equal( 1 );



    expect( nsky.parent ).to.be.ok();
    expect( nsky.parent.name ).to.be.equal('mesh');
  });


});

