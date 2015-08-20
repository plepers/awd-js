'use strict';


var awdlib = require('libawd' );
var optx = require('extoptx' );

var Awd = awdlib.awd,
    Consts = awdlib.consts,
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Texture = optx.Texture,
    Ext = optx.ext;




function createOptxEmbedTexture(){
  var tex = new Texture()
  tex.name = 'embedTexture'
  var data = new Uint32Array(128);
  for (var i = 0; i < 128; i++) {
    data[i] = i*2
  }
  tex.embedData = new Uint8Array( data.buffer );
  return tex;
}


function createOptxExternalTexture(){
  var tex = new Texture()
  tex.name = 'externalTexture'
  tex.uri = 'http://test.com/tex/texture.jpg';
  return tex;
}



describe( "optx material test", function(){



  var awdBuf, awd;

  beforeEach(function(  ){

    awd = new Awd( );
    awd.addExtension( Ext.getExtension() );

  });


  it( "write new embed texture", function(){

    var tex = createOptxEmbedTexture()
    awd.addElement( tex );
    var buf = awd.write();

  });


  it( "write and read back new embed texture", function(){

    var tex = createOptxEmbedTexture()
    awd.addElement( tex );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var textures = nawd.getDatasByType( Ext.OPTX_TEXTURE, Ext.URI );

    expect( textures.length ).to.be.equal( 1 );
    var tex = textures[0];

    expect( tex.name ).to.be('embedTexture');

    expect( tex.embedData.length ).to.be( 128*4 );
    var u32 = new Uint32Array( tex.embedData.buffer.slice(tex.embedData.byteOffset, tex.embedData.byteOffset + tex.embedData.byteLength ) )
    expect( u32[2] ).to.be( 4 );
    expect( u32[127] ).to.be( 127*2 );

    expect( tex.uri ).to.be(null);



  });

  it( "write new external texture", function(){

    var tex = createOptxExternalTexture()
    awd.addElement( tex );
    var buf = awd.write();

  });


  it( "write and read back new external texture", function(){

    var tex = createOptxExternalTexture()
    awd.addElement( tex );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var textures = nawd.getDatasByType( Ext.OPTX_TEXTURE, Ext.URI );

    expect( textures.length ).to.be.equal( 1 );
    var tex = textures[0];

    expect( tex.name ).to.be('externalTexture');
    expect( tex.uri ).to.be('http://test.com/tex/texture.jpg');

    expect( tex.embedData ).to.be( null );




  });


});

