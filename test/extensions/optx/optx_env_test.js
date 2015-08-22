'use strict';


var awdlib = require('libawd' );
var optx = require('libawd_optx' );

var Awd = awdlib.awd,
    Consts = awdlib.consts,
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    utils  = require('./optx_utils'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Env = optx.Env,
    Texture = optx.Texture,
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

function createOptxEnvA(){
  var env = new Env()
  env.name = 'envA'

  env.matrix.data[0] = 2.0;
  env.matrix.data[5] = 2.0;
  env.matrix.data[10] = 2.0;

  env.brightness = .7;

  env.envMap = createTex();
  env.shCoefs = new Float32Array( 27 );

  env.shCoefs[0] = .2;
  env.shCoefs[4] = .6;
  env.shCoefs[5] = .9;
  env.shCoefs[26] = .1;

  var mesh = utils.createMesh();
  mesh.addChild( env );


  return env;

}



describe( "optx Env test", function(){



  var awdBuf, awd;

  beforeEach(function(  ){

    awd = new Awd( );
    awd.addExtension( Ext.getExtension() );

  });

  it( "write new Env A", function(){

    var env = createOptxEnvA()
    awd.addElement( env );
    var buf = awd.write();
  });


  it( "write and read back new Env A", function(){

    var env = createOptxEnvA()
    awd.addElement( env );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var envs = nawd.getDatasByType( Ext.OPTX_ENV, Ext.URI );

    expect( envs.length ).to.be.equal( 1 );
    var nenv = envs[0];

    expect( nenv.name ).to.be('envA')


    numEqals( nenv.matrix.data[0]  , 2.0 );
    numEqals( nenv.matrix.data[5]  , 2.0 );
    numEqals( nenv.matrix.data[10] , 2.0 );

    expect(   nenv.envMap   ).to.be.ok();

    expect(   nenv.envMap.name   ).to.be.equal( 'externalTexture'  );

    numEqals( nenv.brightness        , .7 );

    expect(   nenv.shCoefs   ).to.be.ok();
    compArray( nenv.shCoefs, env.shCoefs );




    expect( nenv.parent ).to.be.ok();
    expect( nenv.parent.name ).to.be.equal('mesh');


  });


});

