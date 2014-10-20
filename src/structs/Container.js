(function(){

  var Consts = AWD.Consts;


  var Container = function(){
    this.name = "";
    this.parent = null;
  };

  Container.prototype = {

    read : function( reader ){

      var parent_id = reader.U32();

      var mtx = this.awd.makeMatrix3D();
      mtx.read( reader );

      this.name = AWD.Parser.parseVarString( reader );

      var mtxType = this.awd.header.matrixNrType;

      var props = new AWD.Properties({
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
      var match = this.awd.getAssetByID(parent_id, [ AWD.Container, AWD.Mesh ] );
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

  AWD.BaseStruct.extend( Container.prototype );

  AWD.Container = Container;

}());