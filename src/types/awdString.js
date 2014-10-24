
module.exports = {

  read : function( reader ) {
    var l = reader.U16();
    return reader.readUTFBytes( l );
  },

  write : function( string, writer ) {
    writer.U16( string.length );
    writer.writeUTFBytes( string );
  },


  getUTFBytesLength : function ( string ) {

    // TODO: Use native implementations if/when available
    var res = 0;

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


      res += neededBytes;
    }

    return res;
  }


};