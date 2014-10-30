(function () {



  var Block = function( ) {

    this.oid    = 0;
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
      this.oid    =
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

      var sptr = writer.skipBlockSize();

      this.data.write( writer );

      writer.writeBlockSize( sptr );

    },


    prepareAndAdd : function( list ){

      if( list.indexOf( this ) > -1 ){
        return;
      }
      this.data.prepareBlock( this );

      var dependencies = this.data.getDependencies();
      // add namespace here?


      if( dependencies !== null ) {

        for (var i = 0, l = dependencies.length; i < l; i++) {
          dependencies[i].block.prepareAndAdd( list );
        }

      }

      this.id = list.length + 1;

      list.push( this );

    }

  };




  // var BlockList = function() {
  //   this._blocks = [];
  // };

  // BlockList.prototype = {

  //   append : function(block) {
  //     if( this._blocks.indexOf( block ) === -1 ) {
  //       this._blocks.push( block );
  //     }
  //   },


  //   remove : function( block ) {
  //     var index = this._blocks.indexOf( block );
  //     if( index > -1 ) {
  //       this._blocks.splice( index, 1 );
  //     }
  //   }


  // }


  module.exports = Block;

}());