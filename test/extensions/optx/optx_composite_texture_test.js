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
    CompositeTexture = optx.CompositeTexture,
    Ext = optx.ext;




function createOptxCompositeTexture(){
  var comps = [];

  var tex = new Texture()
  tex.name = 'compo1'
  tex.uri = 'http://test.com/tex/compo1.jpg';
  comps.push( { out : 'rgb', tex: tex, comps:'rgb'});

  tex = new Texture()
  tex.name = 'compo2'
  tex.uri = 'http://test.com/tex/compo2.jpg';
  comps.push( { out : 'a', tex: tex, comps:'r'});

  var compositeTex = new CompositeTexture();
  compositeTex.name = 'compositeA';
  compositeTex.components = comps;

  return compositeTex;

}





describe( "optx composite texture test", function(){



  var awdBuf, awd;

  beforeEach(function(  ){

    awd = new Awd( );
    awd.addExtension( Ext.getExtension() );

  });


  it( "write new composite", function(){

    var tex = createOptxCompositeTexture()
    awd.addElement( tex );
    var buf = awd.write();

  });


  it( "write and read back new composite texture", function(){

    var tex = createOptxCompositeTexture()
    awd.addElement( tex );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var textures = nawd.getDatasByType( Ext.OPTX_TEXTURE, Ext.URI );
    expect( textures.length ).to.be.equal( 2 );


    var composites = nawd.getDatasByType( Ext.OPTX_COMPOSITE_TEXTURE, Ext.URI );
    expect( composites.length ).to.be.equal( 1 );

    var ntex = composites[0];

    expect( ntex.components ).to.be.ok();
    expect( ntex.components.length ).to.be.equal( 2 );
    expect( ntex.components[0].out   ).to.be.equal( tex.components[0].out   );
    expect( ntex.components[0].comps ).to.be.equal( tex.components[0].comps );
    expect( ntex.components[1].out   ).to.be.equal( tex.components[1].out   );
    expect( ntex.components[1].comps ).to.be.equal( tex.components[1].comps );
    expect( ntex.components[0].tex.name   ).to.be.equal( 'compo1'  );
    expect( ntex.components[1].tex.name   ).to.be.equal( 'compo2'  );




  });



});

