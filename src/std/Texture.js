(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "../types/properties" ),
      AwdString   = require( "../types/awdString" ),
      Consts      = require( "../consts" ),
      UserAttr    = require( "../types/userAttr" ),
      BaseStruct  = require( '../BaseStruct' );

  var Texture = BaseStruct.createStruct( Consts.Texture, null,

  {

    init : function( ){
      this.name = "";
      this.type = 0;

      this.url = null;
      this.data = null;

      this.extras = new UserAttr();

      this.model = Consts.MODEL_TEXTURE;
    },


    read : function( reader ){
      this.name = AwdString.read( reader );
      this.type = reader.U8();

      var str_len = reader.U32();
      //External texture
      if( this.type === 0 ){
        this.url = reader.readUTFBytes( str_len );
        console.log( this.url );
      }
      //Embed texture
      else {
        this.data = new ArrayBuffer( str_len );
        reader.readBytes( this.data, str_len );
      }

      new Properties().read( reader );

      this.extras.read( reader );

    },



    write : function( writer ) {

      AwdString.write( this.name, writer );
      writer.U8( this.type );

      var sptr = writer.skipBlockSize();

      if( this.url !== null && this.data === null ){
        writer.writeUTFBytes( this.url );
      }
      else if(  this.url === null && this.data !== null ){
        writer.writeBytes( this.data );
      }

      writer.writeBlockSize( sptr );

      this.extras.write( writer );
    },

    toString : function(){

    }



  } );


  module.exports = Texture;

}());