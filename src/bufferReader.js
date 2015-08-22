(function () {

  var BufferReader = function( buffer, byteOffset, byteLength ){

    this.buffer = buffer;
    this.ptr = 0;

    this.littleEndien = true;

    byteOffset = byteOffset || 0;
    byteLength = byteLength || buffer.byteLength;

    this.view = new DataView( buffer, byteOffset, byteLength );

    this.length = this.view.byteLength;

  };

  BufferReader.prototype = {

    setPosition : function( p ){
      this.ptr = p;
    },

    setLittleEndian : function( flag ){
      this.littleEndien = flag;
    },

    bytesAvailable : function(){
      return this.length - this.ptr;
    },


    I8 : function(){
      return this.view.getInt8( this.ptr++ );
    },

    U8 : function(){
      return this.view.getUint8( this.ptr++ );
    },

    I16 : function(){
      var r = this.view.getInt16( this.ptr, this.littleEndien );
      this.ptr += 2;
      return r;
    },

    U16 : function(){
      var r = this.view.getUint16( this.ptr, this.littleEndien );
      this.ptr += 2;
      return r;
    },

    I32 : function(){
      var r = this.view.getInt32( this.ptr, this.littleEndien );
      this.ptr += 4;
      return r;
    },

    U32 : function(){
      var r = this.view.getUint32( this.ptr, this.littleEndien );
      this.ptr += 4;
      return r;
    },

    F32 : function(){
      var r = this.view.getFloat32( this.ptr, this.littleEndien );
      this.ptr += 4;
      return r;
    },

    F64 : function(){
      var r = this.view.getFloat64( this.ptr, this.littleEndien );
      this.ptr += 8;
      return r;
    },

    readBytes : function( destBuffer, length ){
      if( length === undefined ) {
        length = destBuffer.byteLength;
      }
      var output = new Int8Array( destBuffer );
      var source = new Int8Array( this.buffer, this.ptr, length );
      output.set( source );
      this.ptr += length;
    },

    subArray : function( length ){
      var res =  new Int8Array( this.buffer, this.ptr, length );
      this.ptr += length;
      return res;
    },

    readUTFBytes : function ( len ) {

      // TODO: Use native implementations if/when available
      var end = this.ptr + len;
      var out = [], c = 0,
          c1, c2, c3;

      while ( this.ptr < end ) {
        c1 = this.U8();
        if (c1 < 128) {
          out[c++] = String.fromCharCode(c1);
        } else if (c1 > 191 && c1 < 224) {
          c2 = this.U8();
          out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
        } else {
          c2 = this.U8();
          c3 = this.U8();
          out[c++] = String.fromCharCode(
              (c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63
          );
        }
      }

      return out.join('');
    }

  };

  module.exports = BufferReader;

}());

