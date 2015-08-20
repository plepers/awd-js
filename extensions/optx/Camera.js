
var awdjs = require( 'libawd' ),

    AwdString    = awdjs.awdString,
    Consts       = awdjs.consts,
    BaseElement  = awdjs.BaseElement,
    Container    = awdjs.Container,
    //Properties   = awdjs.properties,
    UserAttr     = awdjs.userAttr;


var ExtInfos     = require( 'optx/extInfos' );

var LENS_PERSPECTIVE = 0,
    LENS_ORTHOGRAPHIC = 1;




var Camera = BaseElement.createStruct( ExtInfos.OPTX_CAMERA, ExtInfos.URI,
{

  init : function( ){

    this.model = Consts.MODEL_CAMERA;

    Container.super( this );

    this.name       =  '';
    this.extras = new UserAttr();

    this.lensType        = LENS_PERSPECTIVE;

    this.near            = 0.1;
    this.far             = 1000.0;

    this.fov             = 60;

    this.minX            = -20;
    this.maxX            = 20;
    this.minY            = -20;
    this.maxY            = 20;

  },


  makePerspective : function( fov, near, far ){
    this.lensType = LENS_PERSPECTIVE;
    this.fov      = fov;
    this.near     = near;
    this.far      = far;
  },


  makeOrtho : function( minX, maxX, minY, maxY, near, far ){
    this.lensType = LENS_ORTHOGRAPHIC;

    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;

    this.near = near;
    this.far  = far;
  },


  read : function( reader ){


    var parent_id   = reader.U32();
    this.matrix.read( this.awd, reader );
    this.pivot.parsePivot( this.awd, reader );

    this.name       = AwdString.read( reader );

    this.lensType = reader.U8();
    this.near     = reader.F32();
    this.far      = reader.F32();


    if( this.lensType === LENS_PERSPECTIVE )
    {
      this.fov = reader.F32();
    }
    else if( this.lensType === LENS_ORTHOGRAPHIC )
    {
       this.minX = reader.F32();
       this.maxX = reader.F32();
       this.minY = reader.F32();
       this.maxY = reader.F32();
    }

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
      throw new Error("Could not find a parent for this Light "+parent_id);
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

    /*
      write
      ----------------------
    */

    writer.U32( parent_id );
    this.matrix.write( this.awd, writer );
    this.pivot.writePivot( this.awd, writer );
    AwdString.write( this.name, writer );


    writer.U8( this.lensType );
    writer.F32( this.near );
    writer.F32( this.far );


    if( this.lensType === LENS_PERSPECTIVE )
    {
      writer.F32( this.fov );
    }
    else if( this.lensType === LENS_ORTHOGRAPHIC )
    {
      writer.F32( this.minX );
      writer.F32( this.maxX );
      writer.F32( this.minY );
      writer.F32( this.maxY );
    }


    this.extras.write( writer );

  }:undefined,



  getDependencies : function(){
    return null;
  },


  toString : function(){
    return "[Camera " + this.name + "]";
  }



} );


Container.extend( Camera.prototype );

module.exports = Camera;
