
var awdjs = require( 'optx/_awdlib' ).get(),

    //AwdString    = awdjs.awdString,
    Consts       = awdjs.consts,
    BaseElement  = awdjs.BaseElement,
    UserAttr     = awdjs.userAttr,
    Properties   = awdjs.properties;


var ExtInfos     = require( 'optx/extInfos' ),
    Container    = require( 'optx/Container' );


var kP_color              =  1,
    kP_radius             =  2,
    kP_falloffCurve       =  3,
    kP_spotAngle          =  4,
    kP_spotShapness       =  5,
    kP_shadow             =  6;


var pStruct = {};

pStruct[ kP_color          ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_radius         ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_falloffCurve   ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_spotAngle      ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_spotShapness   ] = Consts.AWD_FIELD_FLOAT32;
pStruct[ kP_shadow         ] = Consts.AWD_FIELD_BOOL;




var Light = BaseElement.createStruct( ExtInfos.OPTX_LIGHT, ExtInfos.URI,

{

  init : function( ){

    this.model = Consts.MODEL_LIGHT;

    Container.super( this );

    this.name       =  '';
    this.extras = new UserAttr();

    this.shadow            = true;

    this.color             = [1,1,1];

    this.radius            = 50;
    this.falloffCurve      = 2;

    this.spotAngle         = 70; //deg
    this.spotShapness      = 0.0;

  },


  read : function( reader ){

    this.readNodeCommon( reader );

    var props = new Properties( pStruct );
    props.read( reader );
    this.readProps( props );

    this.extras.read( reader );

  },



  write : ( CONFIG_WRITE ) ?
  function( writer ) {


    this.writeNodeCommon( writer );

    var props = new Properties( pStruct );
    this.setupProps( props );
    props.write( writer );

    this.extras.write( writer );

  }:undefined,


  setupProps : function( props ) {

    props.set( kP_color          , this.color        );
    props.set( kP_radius         , this.radius       );
    props.set( kP_falloffCurve   , this.falloffCurve );
    props.set( kP_spotAngle      , this.spotAngle    );
    props.set( kP_spotShapness   , this.spotShapness );
    props.set( kP_shadow         , this.shadow       );


  },

  readProps : function( props ) {


    this.color         =   props.get( kP_color        , this.color         );
    this.radius        =   props.get( kP_radius       , this.radius        );
    this.falloffCurve  =   props.get( kP_falloffCurve , this.falloffCurve  );
    this.spotAngle     =   props.get( kP_spotAngle    , this.spotAngle     );
    this.spotShapness  =   props.get( kP_spotShapness , this.spotShapness  );
    this.shadow        = !!props.get( kP_shadow       , this.shadow        );

  },





  getDependencies : function(){
    return this.getGraphDependencies();
  },


  toString : function(){
    return "[Light " + this.name + "]";
  }



} );


Container.extend( Light.prototype );

module.exports = Light;
