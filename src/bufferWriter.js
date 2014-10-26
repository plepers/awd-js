(function () {

  require('string.prototype.codepointat');

  var REALLOC = 1024 * 64;

  var BufferWriter = function( size ){

    this.buffer = new ArrayBuffer( size );
    this.ptr = 0;

    this.littleEndien = true;

    this.view = new DataView( this.buffer );

    this.length = this.view.byteLength;

    this.skips = [];

  };

  BufferWriter.prototype = {

    _ensureSize : function( size ) {
      if( this.ptr + size > this.buffer.byteLength ) {
        this._realloc( size );
      }
    },

    _realloc : function( min ){
      var clen = this.buffer.byteLength;
      var reallocSize = REALLOC;
      while( clen + reallocSize < min ) {
        reallocSize += REALLOC;
      }

      var newSize = clen + reallocSize;

      //console.log( newSize , this.buffer.byteLength );
      var buf = new ArrayBuffer( newSize );
      new Int8Array( buf ).set( new Int8Array( this.buffer ) );

      this.buffer = buf;
      this.view = new DataView( buf );
      this.length = buf.length;
    },

    skipBlockSize : function(){
      this.ptr += 4;
      return this.ptr;
    },

    writeBlockSize : function( ptr ){
      var size = this.ptr - ptr;
      var restorePtr = this.ptr;
      this.ptr = ptr - 4;
      this.U32( size );
      this.ptr = restorePtr;
    },


    copy : function() {
      var res = new ArrayBuffer( this.ptr );
      new Int8Array( res ).set( new Int8Array( this.buffer, 0, this.ptr ) );
      return res;
    },

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
      this._ensureSize( 1 );
      return this.view.setInt8( this.ptr++, val );
    },

    U8 : function( val ){
      this._ensureSize( 1 );
      return this.view.setUint8( this.ptr++, val );
    },

    I16 : function( val ){
      this._ensureSize( 2 );
      this.view.setInt16( this.ptr, val, this.littleEndien );
      this.ptr += 2;
    },

    U16 : function( val ){
      this._ensureSize( 2 );
      this.view.setUint16( this.ptr, val, this.littleEndien );
      this.ptr += 2;
    },

    I32 : function( val ){
      this._ensureSize( 4 );
      this.view.setInt32( this.ptr, val, this.littleEndien );
      this.ptr += 4;
    },

    U32 : function( val ){
      this._ensureSize( 4 );
      this.view.setUint32( this.ptr, val, this.littleEndien );
      this.ptr += 4;
    },

    F32 : function( val ){
      this._ensureSize( 4 );
      this.view.setFloat32( this.ptr, val, this.littleEndien );
      this.ptr += 4;
    },

    F64 : function( val ){
      this._ensureSize( 8 );
      this.view.setFloat64( this.ptr, val, this.littleEndien );
      this.ptr += 8;
    },

    writeBytes : function( srcBuffer, length ){
      if( length === undefined ) {
        length = srcBuffer.byteLength;
      }
      //console.log( this.buffer.byteLength, this.ptr, length );
      this._ensureSize( length );
      //console.log( this.buffer.byteLength, this.ptr, length );
      var output = new Int8Array( this.buffer, this.ptr, length );
      var source = new Int8Array( srcBuffer, 0, length );
      output.set( source );
      this.ptr += length;
    },

    writeUTF : function( string ) {
      this._ensureSize( string.length * 4 + 2 );
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



  module.exports = BufferWriter;

}());

