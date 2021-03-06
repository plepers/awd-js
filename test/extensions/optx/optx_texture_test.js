'use strict';


var Awd     = require('../../../lib/awd'),
    Consts = require('../../../lib/consts'),
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Texture  = require('../../../lib/optx/Texture'),
    FileData = require('../../../lib/optx/FileData'),
    Ext      = require('../../../lib/optx/ext');




function createOptxEmbedTexture(){
  var tex = new Texture()
  tex.name = 'embedTexture'
  var data = new Uint32Array(128);
  for (var i = 0; i < 128; i++) {
    data[i] = i*2
  }

  var fd = new FileData( );
  fd.mime = 'mime/custom'
  fd.uri = "fdUriA"
  fd.data = new Uint8Array( data.buffer );
  tex.fileData = fd;

  tex.infos = {
    width : 128,
    height : 256,
    glinternalFormat : 20,
    glformat  : 10
  }

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

    var fdData = tex.fileData.data;
    expect( fdData.length ).to.be( 128*4 );
    var u32 = new Uint32Array( fdData.buffer.slice(fdData.byteOffset, fdData.byteOffset + fdData.byteLength ) )
    expect( u32[2] ).to.be( 4 );
    expect( u32[127] ).to.be( 127*2 );

    expect( tex.fileData.mime ).to.be('mime/custom');
    expect( tex.fileData.uri  ).to.be('fdUriA');
    expect( tex.uri ).to.be(null);

    var infos = tex.infos;

    expect( infos.width            ).to.be.equal( 128 );
    expect( infos.height           ).to.be.equal( 256 );
    expect( infos.glinternalFormat ).to.be.equal( 20 );
    expect( infos.glformat         ).to.be.equal( 10 );




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

    expect( tex.fileData ).to.be( null );




  });


});

