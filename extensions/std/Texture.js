(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "types/properties" ),
      AwdString   = require( "types/awdString" ),
      Consts      = require( "consts" ),
      UserAttr    = require( "types/userAttr" ),
      BaseElement = require( 'BaseElement' );

  var Texture = BaseElement.createStruct( Consts.TEXTURE, null,

  {

    init : function( ){
      this.name = "";
      this.texType = 0;

      this.url = null;
      this.data = null;

      this.extras = new UserAttr();

      this.model = Consts.MODEL_TEXTURE;
    },


    read : function( reader ){
      this.name = AwdString.read( reader );
      this.texType = reader.U8();

      var str_len = reader.U32();
      //External texture
      if( this.texType === 0 ){
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



    write : ( CONFIG_WRITE ) ?
    function( writer ) {

      AwdString.write( this.name, writer );
      writer.U8( this.texType );

      var sptr = writer.skipBlockSize();

      if( this.url !== null && this.data === null ){
        writer.writeUTFBytes( this.url );
      }
      else if(  this.url === null && this.data !== null ){
        writer.writeBytes( this.data );
      }

      writer.writeBlockSize( sptr );

      this.extras.write( writer );
    }:undefined,

    toString : function(){

    }



  } );


  module.exports = Texture;

}());