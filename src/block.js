(function () {

  var BufferReader  = require( './bufferReader' ),
      Metadata      = require( './structs/Metadata' ),
      Container     = require( './structs/Container' );

  var Block = function( ) {

    this.id     = 0;
    this.ns     = 0;
    this.type   = 0;
    this.flags  = 0;
    this.size   = 0;

    this.buffer = null;
    this.data   = null;

  };

  Block.prototype = {

    read : function( reader )
    {

      this.id     = reader.U32();
      this.ns     = reader.U8();
      this.type   = reader.U8();
      this.flags  = reader.U8();

      var size    = reader.U32(),
          buffer  = new ArrayBuffer( size );

      reader.readBytes( buffer, size );

      this.size   = size;
      this.buffer = buffer;

    },

    write : function( writer )
    {
      writer.xx();
    },


    parseData : function( awd ){

      var Class = _StructFactory( this );

      if( Class ) {
        var reader = new BufferReader( this.buffer );

        this.data = new Class();
        this.data.init( awd );
        this.data.read( reader );
        return true;
      }

      return false;
    }


  };


  var _StructFactory = function( block ){
    var type = block.type;

    switch( type ) {
      case 255 :
        return Metadata;
      case 22 :
        return Container;
      default :
        return null;
    }

  };


  module.exports = Block;

}());