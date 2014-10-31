(function (){

  var BufferWriter  = require( "./bufferWriter" );


  var ALLOC = 1024 * 256;

  var Writer = {

    write : function( awd ){

      var writer = new BufferWriter( ALLOC );

      writer.ptr = awd.header.size;




      // prepares blocks list
      var blocks = awd._blocks,
          block;

      var sorted = [];

      for (var i = 0, l = blocks.length; i < l; i++) {
        block = blocks[i];
        block.data._setup( awd, block );
        block.prepareAndAdd( awd, sorted );
      }


      for ( i = 0, l = sorted.length; i < l; i++) {
        sorted[i].write( writer );
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