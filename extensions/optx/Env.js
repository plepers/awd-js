
var awdjs = require( 'libawd' ),

    AwdString    = awdjs.awdString,
    Consts       = awdjs.consts,
    BaseElement  = awdjs.BaseElement,
    Container    = awdjs.Container,
    // Properties   = awdjs.properties,
    UserAttr     = awdjs.userAttr;


var ExtInfos     = require( 'optx/extInfos' );


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


var SH_TYPE_TRANSPOSED = 0, // 7 * vec4
    SH_TYPE_REGULAR    = 1; // 9 * vec3


function getSHLenghtForType( type ){
  return (type === SH_TYPE_TRANSPOSED ) ? 28 : 27;
}

function getSHTypeForLength( length ){
  return (length === 28 ) ? SH_TYPE_TRANSPOSED : SH_TYPE_REGULAR;
}

var Env = BaseElement.createStruct( ExtInfos.OPTX_ENV, ExtInfos.URI,

{

  init : function( ){

    this.model = Consts.MODEL_CONTAINER;

    Container.super( this );

    this.name       =  '';
    this.extras = new UserAttr();

    this.shCoefs           = null;
    this.brightness        = 1.0;

    this.envMap            = null;

  },


  read : function( reader ){


    var parent_id   = reader.U32();
    this.matrix.read( this.awd, reader );

    this.name       = AwdString.read( reader );

    var envMap_id   = reader.U32();

    // Spherical Harmonics
    // ------------------

    var shType      = reader.U8();
    var numCoeffs = getSHLenghtForType( shType );
    this.shCoefs = new Float32Array( numCoeffs );
    for( var i = 0; i < numCoeffs; i++ ){
      this.shCoefs[i] = reader.F32();
    }


    this.brightness = reader.F32();

    this.extras.read( reader );


    /*
      resolves dependancies
      ----------------------
    */

    var match = this.awd.getAssetByID(parent_id, [ Consts.MODEL_CONTAINER, Consts.MODEL_MESH, Consts.MODEL_LIGHT, Consts.MODEL_ENTITY, Consts.MODEL_SEGMENT_SET ] );
    if ( match[0] ) {
      // weak dependency w/ other types
      if( match[1].addChild !== undefined ) {
        match[1].addChild( this );
      }

      this.parent = match[1];

    } else if (parent_id > 0) {
      throw new Error("Could not find a parent for this Env "+parent_id);
    }


    match = this.awd.getAssetByID( envMap_id, [ Consts.MODEL_TEXTURE ] );

    if ((!match[0]) && (match > 0)) {
      throw new Error("Could not find EnvMap (ID = " + envMap_id + " ) for this Env");
    }
    if(envMap_id > 0){
      this.envMap = match[1];
    }


  },



  write : ( CONFIG_WRITE ) ?
  function( writer ) {

    /*
      resolves dependancies
      ----------------------
    */

    var parent_id = 0;
    var parent = this.parent;
    if( parent ) {
      parent_id = parent.chunk.id;
    }

    if( ! this.envMap ){
      throw new Error( 'Env have no envMap');
    }

    var envMap_id = this.envMap.chunk.id;

    /*
      write
      ----------------------
    */

    writer.U32( parent_id );
    this.matrix.write( this.awd, writer );
    AwdString.write( this.name, writer );

    writer.U32( envMap_id );


    if( ! this.shCoefs ){
      throw new Error( 'Env have no sh');
    }

    writer.U8( getSHTypeForLength( this.shCoefs.length ) );

    for( var i = 0; i < this.shCoefs.length; i++ ){
      writer.F32( this.shCoefs[i] );
    }

    writer.F32( this.brightness );


    this.extras.write( writer );

  }:undefined,



  getDependencies : function(){
    var res = [];

    if( this.parent ) {
      res.push( this.parent );
    }

    if( this.envMap ) {
      res.push( this.envMap );
    }

    return res;
  },


  toString : function(){
    return "[Env " + this.name + "]";
  }



} );


Container.extend( Env.prototype );

module.exports = Env;