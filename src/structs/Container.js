(function(){

  var UserAttr    = require( "../types/userAttr" ),
      AwdString   = require( "../types/awdString" ),
      typesMisc   = require( "../types/misc" ),
      Consts      = require( "../consts" );

  var Polys       = require( "polys" ),
      PContainer  = Polys.Container;



  var Container = function(){
    this.type = Consts.TYPE_CONTAINER;
    this.pData = new PContainer();
  };

  Container.prototype = {

    read : function( reader ){


      var parent_id = reader.U32();

      var mtx = this.awd.makeMatrix3D();
      mtx.read( reader );


      var name = AwdString.read( reader );

      var pivot = typesMisc.parsePivot( this.awd, reader );

      var extras = UserAttr.read( reader );

      var pData = this.pData;

      pData.matrix  = mtx.toPolysData();
      pData.pivot   = pivot;
      pData.name    = name;
      pData.extras  = extras;

      // var match = this.awd.getAssetByID(parent_id, [AWD.Container, AWD.Light, AWD.Mesh, AWD.Entity, AWD.SegmentSet ] );
      var match = this.awd.getAssetByID(parent_id, [Consts.TYPE_CONTAINER, Consts.TYPE_MESH, Consts.TYPE_LIGHT, Consts.TYPE_ENTITY, Consts.TYPE_SEGMENT_SET ] );

      if ( match[0] )
      {
        match[1].pData.addChild( pData );
      }
      else if (parent_id > 0)
      {
        throw new Error("Could not find a parent for this ObjectContainer3D id : "+parent_id);
      }


    },


    write : function( writer ) {

      var parent_id = 0;
      var parent = this.pData.parent;
      if( parent && parent.struct ) {
        parent_id = parent.struct.id;
      }


      var mtx = this.awd.makeMatrix3D();
      mtx.fromPolysData( this.pData.matrix );



      writer.U32( parent_id );
      mtx.write( writer );
      AwdString.write( this.pData.name, writer );
      typesMisc.writePivot( this.pData.pivot, this.awd, writer );

    },

    getDependencies : function(){
      var parent = this.pData.parent;
      if( parent && parent.struct ) {
        return [parent.struct];
      }
      return null;
    },


    toString : function(){
      return "[Container " + this.pData.name + "]";
    }



  };

  require( './BaseStruct' ).extend( Container.prototype );

  module.exports = Container;

}());