(function(){

  var Consts      = require( "../consts" );


  var Geometry = function(){
    this.type = Consts.TYPE_GEOMETRY;
  };

  Geometry.prototype = {

    read : function( reader ){

      return reader;

    },


    write : function( writer ) {
      writer.U32( 0xFFFFFFFF );
    },

    toString : function(){
      return "[Geometry " + this.name + "]";
    }



  };

  require( './BaseStruct' ).extend( Geometry.prototype );

  module.exports = Geometry;

}());