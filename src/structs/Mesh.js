(function(){

  // var Consts = AWD.Consts;
  var AwdString   = require( "../types/awdString" ),
      UserAttr    = require( "../types/userAttr" ),
      typesMisc   = require( "../types/misc" ),
      Consts      = require( "../consts" );


  var Mesh = function(){
    this.type = Consts.TYPE_MESH;
    this.pData = {};
  };

  Mesh.prototype = {

    read : function( reader ){

      var parent_id = reader.U32();

      var mtx = this.awd.makeMatrix3D();
      mtx.read( reader );

      var name = AwdString.read( reader );


      var geom_id = reader.U32();

      var num_mats = reader.U16();

      for (var i = 0; i < num_mats; i++) {
        var mat_id = reader.U32();
        console.log( mat_id );
      }


      var pivot = typesMisc.parsePivot( this.awd, reader );

      var extras = UserAttr.read( reader );


      var match = this.awd.getAssetByID( geom_id, [ Consts.TYPE_GEOMETRY ] );
      if ( match[0] ) {
        this.geometry = match[1];
      } else {
        //throw new Error("Could not find a geometry for this Mesh");
      }

      match = this.awd.getAssetByID(parent_id, [ Consts.TYPE_CONTAINER, Consts.TYPE_MESH, Consts.TYPE_LIGHT, Consts.TYPE_ENTITY, Consts.TYPE_SEGMENT_SET ] );
      if ( match[0] ) {
        this.parent = match[1];

      } else if (parent_id > 0) {
        throw new Error("Could not find a parent for this Mesh "+parent_id);
      }



      var pData = this.pData;

      pData.matrix  = mtx.toPolysData();
      pData.pivot   = pivot;
      pData.name    = name;
      pData.extras  = extras;

    },



    write : function( writer ) {
      writer.U32( 0xFFFFFFFF );
    },



    getDependencies : function(){
      var res = [];

      // todo materials

      if( this.pData.parent && this.pData.parent.struct ) {
        res.push( this.pData.parent.struct );
      }

      if( this.geometry ) {
        res.push( this.geometry );
      }


      return null;
    },


    toString : function(){
      return "[Mesh " + this.pData.name + "]";
    }



  };

  require( './BaseStruct' ).extend( Mesh.prototype );

  module.exports = Mesh;

}());