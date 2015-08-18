
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
    kP_skin               = 13,
    kP_subdermisColor     = 14,
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
pStruct[ kP_skin              ] = Consts.AWD_FIELD_BOOL;
pStruct[ kP_subdermisColor    ] = Consts.AWD_FIELD_FLOAT32;
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
      subdermisTex : null
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


    // skin
    this.skin               = false;// ( bool )
    this.subdermisColor     = [1, 1, 1]           ;// ( vec3 )
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

    var props = new Properties( pStruct );
    props.read( reader );
    this.readProps( props );



    this.extras.read( reader );


  },



  write : ( CONFIG_WRITE ) ?
  function( writer ) {

    AwdString.write( this.name, writer );

    var props = new Properties( pStruct );
    this.setupProps( props );
    props.write( writer );

    this.extras.write( writer );

  }:undefined,


  setupProps : function( props ) {


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
      props.set( kP_skin            , this.skin              );
    }

    if( this.skin ) {
      props.set( kP_subdermisColor  , this.subdermisColor    );
      props.set( kP_transColor      , this.transColor        );
      props.set( kP_fresnelColor    , this.fresnelColor      );
      props.set( kP_fresnelOcc      , this.fresnelOcc        );
      props.set( kP_fresnelGlossMask, this.fresnelGlossMask  );
      props.set( kP_transSky        , this.transSky          );
      props.set( kP_shadowBlur      , this.shadowBlur        );
      props.set( kP_normalSmooth    , this.normalSmooth      );
    }

    props.set( kP_unlit             , this.unlit             );

  },

  readProps : function( props ) {


    this.blend              = props.get( kP_blend,            this.blend              );

    this.alphaThreshold     =  props.get( kP_alphaThreshold  , this.alphaThreshold    );
    this.dithering          = (props.get( kP_dithering       , this.dithering         ) & 1) === 1;
    this.fresnel            =  props.get( kP_fresnel         , this.fresnel           );
    this.horizonOcclude     =  props.get( kP_horizonOcclude  , this.horizonOcclude    );

    this.vertexColor        = (props.get( kP_vertexColor     , this.vertexColor       ) & 1) === 1;
    this.vertexColorAlpha   = (props.get( kP_vertexColorAlpha, this.vertexColorAlpha  ) & 1) === 1;
    this.vertexColorSRGB    = (props.get( kP_vertexColorSRGB , this.vertexColorSRGB   ) & 1) === 1;
    this.aniso              = (props.get( kP_aniso           , this.aniso             ) & 1) === 1;

    this.anisoStrength      =  props.get( kP_anisoStrength   , this.anisoStrength     );
    this.anisoIntegral      =  props.get( kP_anisoIntegral   , this.anisoIntegral     );
    this.anisoTangent       =  props.get( kP_anisoTangent    , this.anisoTangent      );
    this.skin               = (props.get( kP_skin            , this.skin              ) & 1) === 1;

    this.subdermisColor     =  props.get( kP_subdermisColor  , this.subdermisColor    );
    this.transColor         =  props.get( kP_transColor      , this.transColor        );
    this.fresnelColor       =  props.get( kP_fresnelColor    , this.fresnelColor      );
    this.fresnelOcc         =  props.get( kP_fresnelOcc      , this.fresnelOcc        );
    this.fresnelGlossMask   =  props.get( kP_fresnelGlossMask, this.fresnelGlossMask  );
    this.transSky           =  props.get( kP_transSky        , this.transSky          );
    this.shadowBlur         =  props.get( kP_shadowBlur      , this.shadowBlur        );
    this.normalSmooth       =  props.get( kP_normalSmooth    , this.normalSmooth      );

    this.unlit              = (props.get( kP_unlit           , this.unlit             ) & 1) === 1;

  },





  getDependencies : function(){
    return null;
    // var res = [];

    // var sublen = this.submeshes.length;

    // for (var i = 0; i < sublen; i++) {
    //   var mat = this.submeshes[i].material;
    //   if( mat ) {
    //     res.push( mat );
    //   }
    // }

    // if( this.parent ) {
    //   res.push( this.parent );
    // }

    // if( this.geometry ) {
    //   res.push( this.geometry );
    // }

    // return res;
  },


  toString : function(){
    return "[Material " + this.pData.name + "]";
  }



} );

module.exports = Material;
