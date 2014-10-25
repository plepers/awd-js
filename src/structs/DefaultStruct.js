var Consts = require( "../consts" );

var DefaultStruct = function( block ) {
  this.block = block;
  this.awd = null;
  this.buf = null;
  this.type = Consts.TYPE_GENERIC;
};

DefaultStruct.prototype = {

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


};



require( './BaseStruct' ).extend( DefaultStruct.prototype );


module.exports = DefaultStruct;