(function(){

  // var Consts = AWD.Consts;
  var AwdString   = require( "../types/awdString" ),
      Consts      = require( "../consts" ),
      BaseStruct  = require( './BaseStruct' );

  var Namespace = BaseStruct.createStruct( Consts.NAMESPACE, null,

  {

    init : function( ){
      this.uri = "";
      this.id  = 0;
    },


    read : function( reader ){
      this.id = reader.U8();
      this.uri = AwdString.read( reader );
    },



    write : function( writer ) {
      writer.U8( this.id );
      AwdString.write( this.uri, writer );
    }



  } );


  module.exports = Namespace;

}());