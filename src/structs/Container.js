(function(){

  var UserAttr    = require( "../types/userAttr" ),
      AwdString   = require( "../types/awdString" ),
      Vec3        = require( "../types/vec3" ),
      Matrix4     = require( "../types/matrix" ),
      Consts      = require( "../consts" ),
      BaseStruct  = require( './BaseStruct' );


  var Container = BaseStruct.createStruct( Consts.CONTAINER, Consts.DEFAULT_NS,

  {

    init : function( ){
      this.model = Consts.MODEL_CONTAINER;
      Container.super( this );
    },

    read : function( reader ){


      var parent_id = reader.U32();

      this.matrix.read( this.awd, reader );

      this.name = AwdString.read( reader );

      this.pivot.parsePivot( this.awd, reader );

      this.extras.read( reader );



      // var match = this.awd.getAssetByID(parent_id, [AWD.Container, AWD.Light, AWD.Mesh, AWD.Entity, AWD.SegmentSet ] );
      var match = this.awd.getAssetByID(parent_id, [Consts.MODEL_CONTAINER, Consts.MODEL_MESH, Consts.MODEL_LIGHT, Consts.MODEL_ENTITY, Consts.MODEL_SEGMENT_SET ] );

      if ( match[0] )
      {
        // weak dependency w/ other types
        if( match[1].addChild !== undefined ) {
          match[1].addChild( this );
        }

        this.parent = match[1];
      }
      else if (parent_id > 0)
      {
        throw new Error("Could not find a parent for this ObjectContainer3D id : "+parent_id);
      }


    },


    write : function( writer ) {

      var parent_id = 0;
      var parent = this.parent;
      if( parent ) {
        parent_id = parent.block.id;
      }




      writer.U32( parent_id );
      this.matrix.write( this.awd, writer );

      AwdString.write( this.name, writer );
      this.pivot.writePivot( this.awd, writer );
      this.extras.write( writer );

    },

    getDependencies : function(){
      var parent = this.parent;
      if( parent ) {
        return [parent];
      }
      return null;
    },


    toString : function(){
      return "[Container " + this.name + "]";
    },


    addChild : function( child ){
      if( this.children.indexOf( child ) === -1 ) {
        this.children.push( child );
        child.parent = this;
      }
    },

    removeChild : function( child ) {
      var index = this.children.indexOf( child );
      if( index > -1 ) {
        this.children.splice( index, 1 );
        child.parent = null;
      }
    }



  } );

  Container.extend = function( proto ){
    proto.addChild = Container.prototype.addChild;
    proto.removeChild = Container.prototype.removeChild;
  };

  Container.super = function( obj ){
    obj.parent = null;
    obj.children = [];
    obj.matrix = new Matrix4();
    obj.name = "";
    obj.pivot = new Vec3();
    obj.extras = new UserAttr();
  };


  module.exports = Container;

}());