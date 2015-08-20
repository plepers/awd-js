
var awdjs = require( 'libawd' ),

    AwdString    = awdjs.awdString,
    Consts       = awdjs.consts,
    BaseElement  = awdjs.BaseElement,
    UserAttr     = awdjs.userAttr,
    Properties   = awdjs.properties;


var ExtInfos     = require( 'optx/extInfos' );


var kP_blend              =  1,
    kP_alphaThreshold     =  2,
    kP_dithering          =  3,
    kP_fresnel            =  4,
    kP_horizonOcclude     =  5,
    kP_vertexColor        =  6,
    kP_vertexColorAlpha   =  7,
    kP_vertexColorSRGB    =  8,
    kP_aniso              =  9,
    kP_anisoStrength      = 10,
    kP_anisoIntegral      = 11,
    kP_anisoTangent       = 12,
    kP_subsurface         = 13,
    kP_subsurfaceColor    = 14,
    kP_transColor         = 15,
    kP_fresnelColor       = 16,
    kP_fresnelOcc         = 17,
    kP_fresnelGlossMask   = 18,
    kP_transSky           = 19,
    kP_shadowBlur         = 20,
    kP_normalSmooth       = 21,
    kP_unlit              = 22;

var pStruct = {};

pStruct[ kP_blend             ] = Consts.AWD_FIELD_STRING;
pStruct[ kP_alphaThreshold    ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_dithering         ] = Consts.AWD_FIELD_BOOL;
pStruct[ kP_fresnel           ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_horizonOcclude    ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_vertexColor       ] = Consts.AWD_FIELD_BOOL;
pStruct[ kP_vertexColorAlpha  ] = Consts.AWD_FIELD_BOOL;
pStruct[ kP_vertexColorSRGB   ] = Consts.AWD_FIELD_BOOL;
pStruct[ kP_aniso             ] = Consts.AWD_FIELD_BOOL;
pStruct[ kP_anisoStrength     ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_anisoIntegral     ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_anisoTangent      ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_subsurface        ] = Consts.AWD_FIELD_BOOL;
pStruct[ kP_subsurfaceColor   ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_transColor        ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_fresnelColor      ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_fresnelOcc        ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_fresnelGlossMask  ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_transSky          ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_shadowBlur        ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_normalSmooth      ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_unlit             ] = Consts.AWD_FIELD_BOOL;




var Material = BaseElement.createStruct( ExtInfos.OPTX_MATERIAL, ExtInfos.URI,

{

  init : function( ){

    this.model = Consts.MODEL_MATERIAL;

    this.name       =  '';
    this.extras = new UserAttr();

    this.textures = {
      albedo       : null,
      alpha        : null,
      reflectivity : null,
      gloss        : null,
      normal       : null,
      subsurface   : null
    };

    this.colors = {
      albedo       : 0xFF000000,
      alpha        : 0xFF000000,
      reflectivity : 0xFF000000,
      gloss        : 0xFF000000,
      normal       : 0xFF000000,
      subsurface   : 0xFF000000
    };


    this.blend              = 'none';   // ( str )
    this.alphaThreshold     = 0.0;      // ( float )

    // if blend alpha only normaly
    this.dithering          = false;    // ( bool )
    this.fresnel            = [1, 1, 1];// ( vec3 )
    this.horizonOcclude     = 0.0;      // ( float )

    // Vertex color
    this.vertexColor        = false;    // ( bool )
    this.vertexColorAlpha   = false;    // ( bool )
    this.vertexColorSRGB    = false;    // ( bool )

    // aniso
    this.aniso              = false;    // ( bool )
    this.anisoStrength      = 1;        // ( float )
    this.anisoIntegral      = 0.5;      // ( float )
    this.anisoTangent       = [1, 0, 0];// ( vec3 )


    // subsurface
    this.subsurface         = false;// ( bool )
    this.subsurfaceColor    = [1, 1, 1]           ;// ( vec3 )
    this.transColor         = [1, 0, 0, 0.5]      ;// ( vec4 )
    this.fresnelColor       = [0.2, 0.2, 0.2, 0.5];// ( vec4 )
    this.fresnelOcc         = 1                   ;// ( float )
    this.fresnelGlossMask   = 1                   ;// ( float )
    this.transSky           = 0.5                 ;// ( float )
    this.shadowBlur         = 0.5                 ;// ( float )
    this.normalSmooth       = 0.5                 ;// ( float )


    // misc
    this.unlit              = false;


  },


  read : function( reader ){

    this.name       = AwdString.read( reader );

    this.textures.albedo       = this.readTexture( reader );
    this.textures.alpha        = this.readTexture( reader );
    this.textures.reflectivity = this.readTexture( reader );
    this.textures.gloss        = this.readTexture( reader );
    this.textures.normal       = this.readTexture( reader );
    this.textures.subsurface   = this.readTexture( reader );

    this.colors.albedo         = reader.U32();
    this.colors.alpha          = reader.U32();
    this.colors.reflectivity   = reader.U32();
    this.colors.gloss          = reader.U32();
    this.colors.normal         = reader.U32();
    this.colors.subsurface     = reader.U32();


    var props = new Properties( pStruct );
    props.read( reader );
    this.readProps( props );


    this.extras.read( reader );

  },



  write : ( CONFIG_WRITE ) ?
  function( writer ) {

    AwdString.write( this.name, writer );


    this.writeTexture( this.textures.albedo       , writer );
    this.writeTexture( this.textures.alpha        , writer );
    this.writeTexture( this.textures.reflectivity , writer );
    this.writeTexture( this.textures.gloss        , writer );
    this.writeTexture( this.textures.normal       , writer );
    this.writeTexture( this.textures.subsurface   , writer );


    writer.U32( this.colors.albedo       );
    writer.U32( this.colors.alpha        );
    writer.U32( this.colors.reflectivity );
    writer.U32( this.colors.gloss        );
    writer.U32( this.colors.normal       );
    writer.U32( this.colors.subsurface   );

    var props = new Properties( pStruct );
    this.setupProps( props );
    props.write( writer );

    this.extras.write( writer );

  }:undefined,



  readTexture : function( reader ){

    var texId = reader.U32();
    if( texId > 0 ){
      var match = this.awd.getAssetByID( texId, [ Consts.MODEL_TEXTURE ] );
      if ( match[0] ) {
        return match[1];
      }
      throw new Error("Could not find Texture for this Material, uid : " + texId);
    }
    return null;

  },

  writeTexture : ( CONFIG_WRITE ) ? function( tex, writer ){
    if( tex ) {
      writer.U32( tex.chunk.id );
    } else {
      writer.U32( 0 );
    }
  }:undefined,







  setupProps : ( CONFIG_WRITE ) ? function( props ) {


    props.set( kP_blend, this.blend );

    props.set( kP_alphaThreshold  , this.alphaThreshold    );
    props.set( kP_dithering       , this.dithering         );
    props.set( kP_fresnel         , this.fresnel           );
    props.set( kP_horizonOcclude  , this.horizonOcclude    );

    if( this.vertexColor ) {
      props.set( kP_vertexColor     , this.vertexColor       );
      props.set( kP_vertexColorAlpha, this.vertexColorAlpha  );
      props.set( kP_vertexColorSRGB , this.vertexColorSRGB   );
      props.set( kP_aniso           , this.aniso             );
    }

    if( this.aniso ) {
      props.set( kP_anisoStrength   , this.anisoStrength     );
      props.set( kP_anisoIntegral   , this.anisoIntegral     );
      props.set( kP_anisoTangent    , this.anisoTangent      );
      props.set( kP_subsurface            , this.subsurface              );
    }

    if( this.subsurface ) {
      props.set( kP_subsurfaceColor , this.subsurfaceColor   );
      props.set( kP_transColor      , this.transColor        );
      props.set( kP_fresnelColor    , this.fresnelColor      );
      props.set( kP_fresnelOcc      , this.fresnelOcc        );
      props.set( kP_fresnelGlossMask, this.fresnelGlossMask  );
      props.set( kP_transSky        , this.transSky          );
      props.set( kP_shadowBlur      , this.shadowBlur        );
      props.set( kP_normalSmooth    , this.normalSmooth      );
    }

    props.set( kP_unlit             , this.unlit             );

  } : undefined,

  readProps : function( props ) {


    this.blend              =   props.get( kP_blend,            this.blend              );

    this.alphaThreshold     =   props.get( kP_alphaThreshold  , this.alphaThreshold    );
    this.dithering          = !!props.get( kP_dithering       , this.dithering         );
    this.fresnel            =   props.get( kP_fresnel         , this.fresnel           );
    this.horizonOcclude     =   props.get( kP_horizonOcclude  , this.horizonOcclude    );

    this.vertexColor        = !!props.get( kP_vertexColor     , this.vertexColor       );
    this.vertexColorAlpha   = !!props.get( kP_vertexColorAlpha, this.vertexColorAlpha  );
    this.vertexColorSRGB    = !!props.get( kP_vertexColorSRGB , this.vertexColorSRGB   );
    this.aniso              = !!props.get( kP_aniso           , this.aniso             );

    this.anisoStrength      =   props.get( kP_anisoStrength   , this.anisoStrength     );
    this.anisoIntegral      =   props.get( kP_anisoIntegral   , this.anisoIntegral     );
    this.anisoTangent       =   props.get( kP_anisoTangent    , this.anisoTangent      );
    this.subsurface         = !!props.get( kP_subsurface      , this.subsurface        );

    this.subsurfaceColor    =   props.get( kP_subsurfaceColor , this.subsurfaceColor   );
    this.transColor         =   props.get( kP_transColor      , this.transColor        );
    this.fresnelColor       =   props.get( kP_fresnelColor    , this.fresnelColor      );
    this.fresnelOcc         =   props.get( kP_fresnelOcc      , this.fresnelOcc        );
    this.fresnelGlossMask   =   props.get( kP_fresnelGlossMask, this.fresnelGlossMask  );
    this.transSky           =   props.get( kP_transSky        , this.transSky          );
    this.shadowBlur         =   props.get( kP_shadowBlur      , this.shadowBlur        );
    this.normalSmooth       =   props.get( kP_normalSmooth    , this.normalSmooth      );

    this.unlit              = !!props.get( kP_unlit           , this.unlit             );

  },





  getDependencies : ( CONFIG_WRITE ) ? function(){
    var res = [];
    var texs = this.textures;

    if( texs.albedo       ){
      res.push( texs.albedo       );
    }
    if( texs.alpha        ){
      res.push( texs.alpha        );
    }
    if( texs.reflectivity ){
      res.push( texs.reflectivity );
    }
    if( texs.gloss        ){
      res.push( texs.gloss        );
    }
    if( texs.normal       ){
      res.push( texs.normal       );
    }
    if( texs.subsurface   ){
      res.push( texs.subsurface   );
    }


    return res;
  } : undefined,


  toString : function(){
    return "[Material " + this.pData.name + "]";
  }



} );

module.exports = Material;
