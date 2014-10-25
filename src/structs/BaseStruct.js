(function(){

  var Consts      = require( "../consts" );


  var DefaultStruct = {

    _setup : function( awd, block ){
      this.awd = awd;
      this.block = block;
    },

    init : function( ){
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
      if( this.deps ) {
        return this.deps;
      }

      return null;
    },

    prepareBlock : function( block ){
      if( this.type > 0 ){
        block.type = this.type;
      }
      if( this.ns > -1 ){
        block.ns = this.ns;
      }
    }


  };

  var BaseStruct = {};



  BaseStruct.createStruct = function( type, ns, proto ){

    var Struct = function(){
      this.type = type;
      this.ns = ns;
      this.init();
    };

    Struct.TYPE = type;

    var key;

    for( key in DefaultStruct ){
      Struct.prototype[key] = DefaultStruct[key];
    }
    for( key in proto ){
      Struct.prototype[key] = proto[key];
    }

    return Struct;

  };


  module.exports = BaseStruct;

}());