var BaseElement  = require( '../../src/BaseElement' ),
    UserAttr     = require( '../../src/types/userAttr' ),
    Consts       = require( '../../src/consts' );



var ExtInfos     = require( 'optx/extInfos' ),
    Container    = require( 'optx/Container' );



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


    this.readNodeCommon( reader );

    var env_id      = reader.U32();
    this.skyType       = reader.U8();
    this.brightness = reader.F32();

    this.extras.read( reader );


    /*
      resolves dependancies
      ----------------------
    */
    var match = this.awd.getAssetByID( env_id, [ Consts.MODEL_CONTAINER ] );

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


    if( ! this.env ){
      throw new Error( 'Sky have no env');
    }

    var env_id = this.env.chunk.id;

    /*
      write
      ----------------------
    */

    this.writeNodeCommon( writer );

    writer.U32( env_id );
    writer.U8(  this.skyType );
    writer.F32( this.brightness );


    this.extras.write( writer );

  }:undefined,



  getDependencies : function(){
    var res = this.getGraphDependencies();

    if( this.env ) {
      res.push( this.env );
    }

    return res;
  },


  toString : function(){
    return "[Sky " + this.name + "]";
  }



} );

Sky.SKY_TYPE_SH  = SKY_TYPE_SH ;
Sky.SKY_TYPE_ENV = SKY_TYPE_ENV;

Container.extend( Sky.prototype );

module.exports = Sky;
