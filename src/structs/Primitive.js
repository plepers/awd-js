(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "../types/properties" ),
      AwdString   = require( "../types/awdString" ),
      Consts      = require( "../consts" ),
      BaseStruct  = require( './BaseStruct' );

  var Primitive = BaseStruct.createStruct( Consts.PRIMITIVE, null,

  {

    init : function( ){
      this.name = "";
      this.model = Consts.MODEL_GEOMETRY;
    },


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



  } );


  module.exports = Primitive;

}());