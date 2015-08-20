
var awdjs = require( 'libawd' ),

    AwdString    = awdjs.awdString,
    Consts       = awdjs.consts,
    BaseElement  = awdjs.BaseElement,
    Container    = awdjs.Container,
    // Properties   = awdjs.properties,
    UserAttr     = awdjs.userAttr;


var ExtInfos     = require( 'optx/extInfos' );



var SKY_TYPE_SH  = 0,
    SKY_TYPE_ENV = 1;



var Sky = BaseElement.createStruct( ExtInfos.OPTX_SKY, ExtInfos.URI,

{

  init : function( ){

    this.model = Consts.MODEL_CONTAINER;

    Container.super( this );

    this.name       =  '';
    this.extras = new UserAttr();

    this.brightness        = 1.0;
    this.env               = null;
    this.skyType              = 0;

  },

  useSHMode : function(){
    this.skyType = SKY_TYPE_SH;
  },

  useEnvmapMode : function(){
    this.skyType = SKY_TYPE_ENV;
  },


  read : function( reader ){


    var parent_id   = reader.U32();
    this.matrix.read( this.awd, reader );

    this.name       = AwdString.read( reader );
    var env_id      = reader.U32();
    this.skyType       = reader.U8();
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


    match = this.awd.getAssetByID( env_id, [ Consts.MODEL_CONTAINER ] );

    if ((!match[0]) && (match > 0)) {
      throw new Error("Could not find env (ID = " + env_id + " ) for this Sky");
    }
    if(env_id > 0){
      this.env = match[1];
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

    if( ! this.env ){
      throw new Error( 'Sky have no env');
    }

    var env_id = this.env.chunk.id;

    /*
      write
      ----------------------
    */

    writer.U32( parent_id );
    this.matrix.write( this.awd, writer );
    AwdString.write( this.name, writer );

    writer.U32( env_id );
    writer.U8(  this.skyType );
    writer.F32( this.brightness );


    this.extras.write( writer );

  }:undefined,



  getDependencies : function(){
    var res = [];

    if( this.parent ) {
      res.push( this.parent );
    }

    if( this.env ) {
      res.push( this.env );
    }

    return res;
  },


  toString : function(){
    return "[Sky " + this.name + "]";
  }



} );


Container.extend( Sky.prototype );

module.exports = Sky;
