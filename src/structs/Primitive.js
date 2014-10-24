(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "../types/properties" ),
      AwdString   = require( "../types/awdString" );

  var Primitive = function(){
    this.name = "";
    this.type = 0;
  };

  Primitive.prototype = {

    read : function( reader ){
      this.name = AwdString.read( reader );
      this.type = reader.U8();
      this.props = new Properties();
      this.props.read( reader );
    },



    write : function( writer ) {
      writer.U32( 0xFFFFFFFF );
    },

    toString : function(){

    }



  };

  require( './BaseStruct' ).extend( Primitive.prototype );

  module.exports = Primitive;

}());