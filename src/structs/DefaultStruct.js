var Consts      = require( "../consts" ),
    BaseStruct  = require( './BaseStruct' );

var DefaultStruct = BaseStruct.createStruct( Consts.GENERIC, Consts.DEFAULT_NS,

{

  init : function( ){
    this.buf = null;
    this.model = Consts.MODEL_GENERIC;
  },



  read : function( reader ){
    // store data to write back
    this.buf = new ArrayBuffer( this.block.size );
    reader.readBytes( this.buf, this.block.size );

    this.setDeps();
  },

  write : function( writer ){
    writer.writeBytes( this.buf, this.block.size );
  },

  setDeps : function(){
    // default blocks initially depends on
    // all previously parsed blocks

    var blocks = this.awd._blocks,
        block;

    var deps = [];

    for (var i = 0, l = blocks.length; i < l; i++) {
      block = blocks[i];

      if( block.oid < this.id ){
        deps.push( block.data );
      }
    }

    this.deps = deps;

  },

  getDependencies : function(){
    return this.deps;
  },


} );

module.exports = DefaultStruct;