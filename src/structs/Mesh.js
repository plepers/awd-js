(function(){

  // var Consts = AWD.Consts;
  var AwdString   = require( "../types/awdString" ),
      Container   = require( "./Container" ),
      Geometry    = require( "./Geometry" );


  var Mesh = function(){
    this.name = "";
    this.geometry = null;
    this.parent = null;
  };

  Mesh.prototype = {

    read : function( reader ){

      var parent_id = reader.U32();

      var mtx = this.awd.makeMatrix3D();
      mtx.read( reader );

      this.name = AwdString.read( reader );


      var geom_id = reader.U32();


      var match = this.awd.getAssetByID(parent_id, [ Geometry ] );
      if ( match[0] ) {
        this.geometry = match[1];
      } else {
        throw new Error("Could not find a geometry for this Mesh");
      }

      // match = this.awd.getAssetByID(geom_id, [AWD.Container, AWD.Light, AWD.Mesh, AWD.Entity, AWD.SegmentSet ] );
      match = this.awd.getAssetByID(geom_id, [Container, Mesh ] );
      if ( match[0] ) {
        this.parent = match[1];

      } else if (parent_id > 0) {
        throw new Error("Could not find a parent for this Mesh");
      }

    },

    toString : function(){
      return "[Mesh " + this.name + "]";
    }



  };

  require( './BaseStruct' ).extend( Mesh.prototype );

  module.exports = Mesh;

}());