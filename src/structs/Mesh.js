(function(){

  // var Consts = AWD.Consts;
  var AwdString   = require( "../types/awdString" ),
      Container   = require( "./Container" ),
      Consts      = require( "../consts" );


  var Mesh = function(){
    this.type = Consts.TYPE_MESH;
    this.pData = {};
    Container.super( this );

    this.geometry = null;
    this.materials = [];
  };

  Mesh.prototype = {

    read : function( reader ){

      var parent_id = reader.U32();

      this.matrix.read( this.awd, reader );

      this.name = AwdString.read( reader );


      var geom_id = reader.U32();

      var num_mats = reader.U16();


      for (var i = 0; i < num_mats; i++) {
        var mat_id = reader.U32();
        var matRes = this.awd.getAssetByID( mat_id, [ Consts.TYPE_MATERIAL ] );

        if ((!matRes[0]) && (mat_id > 0)) {
          throw new Error("Could not find Material Nr " + i + " (ID = " + mat_id + " ) for this Mesh");
        }

        if(mat_id > 0){
          this.materials.push( matRes[1] );
        }
      }


      this.pivot.parsePivot( this.awd, reader );
      this.extras.read( reader );





      var match = this.awd.getAssetByID( geom_id, [ Consts.TYPE_GEOMETRY ] );
      if ( match[0] ) {
        this.geometry = match[1];
      } else {
        //throw new Error("Could not find a geometry for this Mesh");
      }

      match = this.awd.getAssetByID(parent_id, [ Consts.TYPE_CONTAINER, Consts.TYPE_MESH, Consts.TYPE_LIGHT, Consts.TYPE_ENTITY, Consts.TYPE_SEGMENT_SET ] );
      if ( match[0] ) {
        // weak dependency w/ other types
        if( match[1].addChild !== undefined ) {
          match[1].addChild( this );
        }

        this.parent = match[1];

      } else if (parent_id > 0) {
        throw new Error("Could not find a parent for this Mesh "+parent_id);
      }



    },



    write : function( writer ) {

      var parent_id = 0;
      var parent = this.parent;
      if( parent ) {
        parent_id = parent.block.id;
      }

      var geom_id = 0;
      var geom = this.geometry;
      if( geom ) {
        geom_id = geom.block.id;
      }






      writer.U32( parent_id );
      this.matrix.write( this.awd, writer );
      AwdString.write( this.name, writer );
      writer.U32( geom_id );

      var ml = this.materials.length;
      writer.U16( ml );
      for (var i = 0; i < ml; i++) {
        var mat = this.materials[i];
        writer.U32( mat.block.id );

      }

      this.pivot.writePivot( this.awd, writer );
      this.extras.write( writer );
    },



    getDependencies : function(){
      var res = [];

      var ml = this.materials.length;

      for (var i = 0; i < ml; i++) {
        var mat = this.materials[i];
        res.push( mat );
      }

      if( this.parent && this.parent.struct ) {
        res.push( this.parent );
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

  Container.extend( Mesh.prototype );
  module.exports = Mesh;

}());