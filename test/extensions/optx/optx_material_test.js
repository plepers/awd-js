'use strict';


var awdlib = require('libawd' );
var optx = require('extoptx' );

var Awd = awdlib.awd,
    Consts = awdlib.consts,
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Material = optx.Material,
    Texture = optx.Texture,
    Ext = optx.ext;


function makeTexture( name ){
  var tex = new Texture()
  tex.name = name;
  tex.uri = 'http://test.com/tex/compo2.jpg';
  return tex;
}

function createOptxMaterialDefault(){
  var mat = new Material()
  mat.name = 'materialDefault'
  return mat;
}


function createOptxMaterialA(){
  var mat = new Material()
  mat.name = 'materialA'

  mat.blend = 'alpha'
  mat.alphaThreshold = .3

  mat.dithering        = true;
  mat.fresnel          = [.9, 1, .8];
  mat.horizonOcclude   = 0.1;
  mat.vertexColor      = true;
  mat.vertexColorAlpha = false;
  mat.vertexColorSRGB  = true;

  mat.aniso            = true;
  mat.anisoStrength    = 1.5;
  mat.anisoIntegral    = .4;
  mat.anisoTangent     = [0, 1, 0];

  mat.subsurface       = true;
  mat.subsurfaceColor  = [.3, .2, .2]        ;
  mat.transColor       = [1, 0, 0, 0.5]      ;
  mat.fresnelColor     = [0.2, 0.2, 0.2, 0.5];
  mat.fresnelOcc       = .9                   ;
  mat.fresnelGlossMask = 1                   ;
  mat.transSky         = 0.4                 ;
  mat.shadowBlur       = 0.4                 ;
  mat.normalSmooth     = 0.4                 ;
  mat.unlit            = false;


  mat.textures.albedo       = makeTexture( 'albedo' );
  mat.textures.reflectivity = makeTexture( 'reflectivity' );
  mat.textures.gloss        = makeTexture( 'gloss' );

  mat.colors.subsurface = 0xFF501010;

  return mat;
}


function compareMats( matA, matB ) {

  function numEqals( n1, n2 ){
    expect( Math.abs(n1 - n2) < 0.00001 ).to.be.equal( true );
  }

  function arrEqals( a1, a2 ){
    expect( a1.length ).to.be.equal( a2.length );
    for( var i = 0; i < a1.length; i++ ) {
      expect( Math.abs(a1[i] - a2[i]) < 0.00001 ).to.be.equal( true );
    }
  }


  numEqals( matA.alphaThreshold   ,         matB.alphaThreshold    );
  numEqals( matA.horizonOcclude   ,         matB.horizonOcclude    );
  numEqals( matA.anisoStrength    ,         matB.anisoStrength     );
  numEqals( matA.anisoIntegral    ,         matB.anisoIntegral     );
  numEqals( matA.fresnelOcc       ,         matB.fresnelOcc        );
  numEqals( matA.fresnelGlossMask ,         matB.fresnelGlossMask  );
  numEqals( matA.transSky         ,         matB.transSky          );
  numEqals( matA.shadowBlur       ,         matB.shadowBlur        );
  numEqals( matA.normalSmooth     ,         matB.normalSmooth      );


  expect( matA.blend            ).to.equal( matB.blend             )
  expect( matA.dithering        ).to.equal( matB.dithering         )
  expect( matA.vertexColor      ).to.equal( matB.vertexColor       )
  expect( matA.vertexColorAlpha ).to.equal( matB.vertexColorAlpha  )
  expect( matA.vertexColorSRGB  ).to.equal( matB.vertexColorSRGB   )
  expect( matA.aniso            ).to.equal( matB.aniso             )
  expect( matA.skin             ).to.equal( matB.skin              )
  expect( matA.unlit            ).to.equal( matB.unlit             )


  arrEqals( matA.fresnel          ,         matB.fresnel           )
  arrEqals( matA.anisoTangent     ,         matB.anisoTangent      )
  arrEqals( matA.transColor       ,         matB.transColor        )
  arrEqals( matA.fresnelColor     ,         matB.fresnelColor      )
  arrEqals( matA.subsurfaceColor  ,         matB.subsurfaceColor   )




}


describe( "optx material test", function(){



  var awdBuf, awd;

  beforeEach(function(  ){

    awd = new Awd( );
    awd.addExtension( Ext.getExtension() );

  });


  it( "write new material default", function(){

    var mat = createOptxMaterialDefault()
    awd.addElement( mat );
    var buf = awd.write();

  });


  it( "write and read back new material Default", function(){

    var mat = createOptxMaterialDefault()
    awd.addElement( mat );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var materials = nawd.getDatasByType( Ext.OPTX_MATERIAL, Ext.URI );

    expect( materials.length ).to.be.equal( 1 );
    var mat = materials[0];

    expect( mat.name ).to.be('materialDefault');

    expect( mat.blend ).to.be( 'none' );
    expect( mat.alphaThreshold ).to.be( 0.0 );
    expect( mat.fresnel[0] ).to.be( 1 );



  });

  it( "write new material A", function(){

    var mat = createOptxMaterialA()
    awd.addElement( mat );
    var buf = awd.write();

    if( fs.writeFile ) {
      if( !fs.existsSync( './test/output/' ) )
        fs.mkdirSync( './test/output/' );

      fs.writeFile( './test/output/test_optx_material.awd', butils.fromArrayBuffer( buf ), function (err) {
        if (err) throw err;
      } );
    }

  });


  it( "write and read back new material A", function(){

    var mat = createOptxMaterialA()
    awd.addElement( mat );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var materials = nawd.getDatasByType( Ext.OPTX_MATERIAL, Ext.URI );

    expect( materials.length ).to.be.equal( 1 );
    var nmat = materials[0];

    compareMats( nmat, mat );

    expect( nmat.textures.albedo ).to.be.ok();
    expect( nmat.textures.albedo.name ).to.be.equal( 'albedo' );
    expect( nmat.textures.reflectivity ).to.be.ok();
    expect( nmat.textures.reflectivity.name ).to.be.equal( 'reflectivity' );
    expect( nmat.textures.gloss ).to.be.ok();
    expect( nmat.textures.gloss.name ).to.be.equal( 'gloss' );

    expect( nmat.textures.subsurface ).not.to.be.ok();
    nmat.colors.subsurface = 0xFF501010;





  });


});

