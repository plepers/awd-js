(function (){

  var BufferReader  = require( "./bufferReader" ),
      Block         = require( "./block" );




  var Parser = {

    parse : function( buffer, awd ){

      var reader = new BufferReader( buffer );

      awd.header.read( reader );

      var block;

      while( reader.bytesAvailable() > 0 ) {
        block = new Block();
        block.read( reader, awd );
        awd.addBlock( block );
        // console.log( ' --------- block ', block.type, block.id, ( block.data !== null ) ? block.data.toString() : 'null' );
      }


    }

  };



  module.exports = Parser;


}());