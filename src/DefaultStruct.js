var Consts      = require( "./consts" ),
    BaseStruct  = require( './BaseStruct' );

var DefaultStruct = BaseStruct.createStruct( Consts.GENERIC, -1, {



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

      deps.push( block );

    }

    this.deps = deps;

  },

  prepareAndAdd : function( awd, list ){

    if( list.indexOf( this ) > -1 ){
      return;
    }

    this.awd = awd;

    var dependencies = this.deps;

    for (var i = 0, l = dependencies.length; i < l; i++) {
      dependencies[i].prepareAndAdd( awd, list );
    }

    this.id = list.length + 1;

    list.push( this );

  },

  prepareBlock : function( ){
    // default can't create block since
    // type and namespace are unknown
  }

} );

module.exports = DefaultStruct;