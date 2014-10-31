(function () {



  var Block = function( ) {

    this.id     = 0;
    this.ns     = 0;
    this.type   = 0;
    this.flags  = 0;
    this.size   = 0;

    this.data   = null;

  };

  Block.prototype = {

    read : function( reader )
    {
      this.id     = reader.U32();

      this.ns     = reader.U8();
      this.type   = reader.U8();
      this.flags  = reader.U8();
      this.size   = reader.U32();



    },

    write : function( writer )
    {

      writer.U32( this.id );
      writer.U8(  this.ns );
      writer.U8(  this.type );
      writer.U8(  this.flags );

    }

  };




  module.exports = Block;

}());