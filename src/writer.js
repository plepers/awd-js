(function (){

  var BufferWriter  = require( "./bufferWriter" );


  var ALLOC = 1024 * 256;

  var Writer = {

    write : function( awd ){

      var writer = new BufferWriter( ALLOC );

      writer.ptr = awd.header.size;




      // prepares blocks list
      var elems = awd._elements,
          elem;

      var sorted = [];

      for (var i = 0, l = elems.length; i < l; i++) {
        elem = elems[i];
        elem.prepareAndAdd( awd, sorted );
      }

      var sptr;

      for ( i = 0, l = sorted.length; i < l; i++) {
        sorted[i].chunk.write( writer );

        sptr = writer.skipBlockSize();
        sorted[i].write( writer );
        writer.writeBlockSize( sptr );
      }

      var end = writer.ptr;

      writer.ptr = 0;
      awd.header.bodylen = end - awd.header.size;


      awd.header.write( writer );

      writer.ptr = end;
      return writer.copy();

    }


  };



  module.exports = Writer;


}());