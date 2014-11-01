var Consts      = require( "./consts" ),
    BaseElement  = require( './BaseElement' );

var DefaultElement = BaseElement.createStruct( Consts.GENERIC, -1, {



  read : function( reader ){
    // store data to write back
    this.buf = new ArrayBuffer( this.chunk.size );
    reader.readBytes( this.buf, this.chunk.size );

    this.setDeps();
  },

  write : function( writer ){
    writer.writeBytes( this.buf, this.chunk.size );
  },

  setDeps : function(){
    // default blocks initially depends on
    // all previously parsed blocks

    var elems = this.awd._elements,
        elem;

    var deps = [];

    for (var i = 0, l = elems.length; i < l; i++) {
      elem = elems[i];

      deps.push( elem );

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

  prepareChunk : function( ){
    // default can't create chunk since
    // type and namespace are unknown
  }

} );

module.exports = DefaultElement;