(function ( AWD ) {


  var BufferWriter = function( buffer, byteOffset, byteLength ){

    this.buffer = buffer;
    this.ptr = 0;

    this.littleEndien = true;

    this.view = new DataView( buffer, byteOffset, byteLength );

    this.length = this.view.byteLength;

  };

  BufferWriter.prototype = {

    setPosition : function( p ){
      this.ptr = p;
    },

    setLittleEndian : function( flag ){
      this.littleEndien = flag;
    },

    bytesAvailable : function(){
      return this.length - this.ptr;
    },


    I8 : function( val ){
      return this.view.setInt8( this.ptr++, val );
    },

    U8 : function( val ){
      return this.view.getUint8( this.ptr++, val );
    },

    I16 : function( val ){
      this.view.getInt16( this.ptr, val, this.littleEndien );
      this.ptr += 2;
    },

    U16 : function( val ){
      this.view.getUint16( this.ptr, val, this.littleEndien );
      this.ptr += 2;
    },

    I32 : function( val ){
      this.view.getInt32( this.ptr, val, this.littleEndien );
      this.ptr += 4;
    },

    U32 : function( val ){
      this.view.getUint32( this.ptr, val, this.littleEndien );
      this.ptr += 4;
    },

    F32 : function( val ){
      this.view.getFloat32( this.ptr, val, this.littleEndien );
      this.ptr += 4;
    },

    F64 : function( val ){
      this.view.getFloat64( this.ptr, val, this.littleEndien );
      this.ptr += 8;
    },

    writeBytes : function( srcBuffer, length ){
      var output = new Int8Array( this.buffer );
      var source = new Int8Array( srcBuffer, 0, length );
      output.set( source );
      this.ptr += length;
    },

    writeUTF : function( string ) {
      this.U16( string.length );
      return this.writeUTFBytes( string );
    },

    writeUTFBytes : function ( string ) {

      // TODO: Use native implementations if/when available

      for(var i = 0, j = string.length; i < j; i++) {
        var charCode = string[i].codePointAt(0);
        var neededBytes;
        if(charCode < 128) {
          neededBytes = 1;
        } else if(charCode < 2048) {
          neededBytes = 2;
        } else if(charCode < 65536) {
          neededBytes = 3;
        } else if(charCode < 2097152) {
          neededBytes = 4;
        }

        if(1 === neededBytes) {
          this.U8( charCode );
        } else {
          // Computing the first byte
          this.U8(
            (_utfHead[neededBytes] << 8 - neededBytes) +
            (charCode >>> ((--neededBytes) * 6))
          );
          // Computing next bytes
          for(;neededBytes>0;) {
            this.U8(  ((charCode>>>((--neededBytes) * 6))&0x3F)|0x80 );
          }
        }
      }
    }

  };



  var _utfHead = (function() {
    var a = [];
    for( var i = 0; i < 5; i++ ) {
      a[i] = parseInt('1111'.slice(0, i), 2);
    }
    return a;
  })();



  AWD.BufferWriter = BufferWriter;

}( AWD ));

