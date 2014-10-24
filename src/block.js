(function () {

  var DefaultStruct = require( './structs/DefaultStruct' ),
      Metadata      = require( './structs/Metadata' ),
      Container     = require( './structs/Container' );
      // Mesh          = require( './structs/Mesh' );

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

    read : function( reader, awd )
    {
      this.oid    =
      this.id     = reader.U32();

      this.ns     = reader.U8();
      this.type   = reader.U8();
      this.flags  = reader.U8();
      this.size   = reader.U32();

      this._parseData( reader, awd );


    },

    write : function( writer )
    {
      writer.U32( this.id );
      writer.U8(  this.ns );
      writer.U8(  this.type );
      writer.U8(  this.flags );

      var p = writer.ptr;
      writer.ptr += 4;

      this.data.write( writer );

      var ep = writer.ptr;

      this.size = ep - p - 4;

      writer.ptr = p;
      writer.U32( this.size );

      writer.ptr = ep;

    },


    prepareAndAdd : function( list ){

      if( list.indexOf( this ) > -1 ){
        return;
      }

      this.data.prepareBlock();

      var dependencies = this.data.getDependencies();

      if( dependencies !== null ) {

        for (var i = 0, l = dependencies.length; i < l; i++) {
          dependencies[i].block.prepareAndAdd( list );
        }

      }

      this.id = list.length + 1;

      list.push( this );

    },


    _parseData : function( reader, awd ){

      this.data = _StructFactory( this );

      this.data.init( awd, this );

      var p = reader.ptr;

      this.data.read( reader );

      if( reader.ptr - p !== this.size ){
        console.log( "Warn bad block parsing , byte delta : ", reader.ptr - p - this.size );
        reader.ptr = p+this.size;
      }

    }


  };


  var _StructFactory = function( block ){
    var type = block.type;

    switch( type ) {
      case 255 :
        return new Metadata();
      case 22 :
        return new Container();
      // case 23 :
      //   return new Mesh();
      default :
        return new DefaultStruct( block );
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