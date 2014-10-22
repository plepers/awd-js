(function(){

  var Consts      = require( "../consts" ),
      Properties  = require( "../types/properties" ),
      AwdString   = require( "../types/awdString" ),
      Mesh        = require( "./Mesh" );

  var PolysContainer = require( "Polys" ).Container;


  var Container = function(){
    this.name = "";
    this.parent = null;
  };

  Container.prototype = {

    read : function( reader ){

      var parent_id = reader.U32();

      var mtx = this.awd.makeMatrix3D();
      mtx.read( reader );

      this.name = AwdString.read( reader );

      var mtxType = this.awd.header.matrixNrType;

      var props = new Properties({
        1: mtxType,
        2: mtxType,
        3: mtxType,
        4: Consts.UINT8
      });

      var pivot = {
        x : props.get(1, 0),
        y : props.get(2, 0),
        z : props.get(3, 0)
      };


      // var match = this.awd.getAssetByID(parent_id, [AWD.Container, AWD.Light, AWD.Mesh, AWD.Entity, AWD.SegmentSet ] );
      var match = this.awd.getAssetByID(parent_id, [ Container, Mesh ] );
      if ( match[0] ) {
        this.parent = match[1];

      } else if (parent_id > 0) {
        throw new Error("Could not find a parent for this ObjectContainer3D id : "+parent_id);
      }

      return {
        pivot : pivot
      };




    },

    toString : function(){
      return "[Container " + this.name + "]";
    }



  };

  require( './BaseStruct' ).extend( Container.prototype );

  module.exports = Container;

}());