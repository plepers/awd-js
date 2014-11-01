(function(){

  var Consts      = require( "./consts" ),
      Chunk       = require( "./chunk" );


  var DefaultElement = {

    _setup : function( awd, chunk ){
      this.awd = awd;
      this.chunk = chunk;
      this.id = chunk.id;
    },

    init : function( ){
      this.model = Consts.MODEL_GENERIC;
    },

    getDependencies : function(){
      if( this.deps ) {
        return this.deps;
      }
      return null;
    },



    prepareAndAdd : function( awd, list ){

      if( list.indexOf( this ) > -1 ){
        return;
      }


      this.awd = awd;

      var dependencies = this.getDependencies();

      if( dependencies !== null ) {
        for (var i = 0, l = dependencies.length; i < l; i++) {
          dependencies[i].prepareAndAdd( awd, list );
        }
      }

      this.id = list.length + 1;

      var ns = awd.resolveNamespace( this );
      if( ns > - 1) {
        this.ns = ns;
      }



      this.prepareChunk();
      list.push( this );

    },

    prepareChunk : function( ){
      if( this.chunk === null ) {
        this.chunk = new Chunk();
      }

      this.chunk.type = this.type;
      this.chunk.ns = this.ns;

    }


  };

  var BaseElement = {};



  BaseElement.createStruct = function( type, nsUri, proto ){

    var Struct = function(){
      this.type = type;
      this.nsUri = nsUri;
      this.ns = 0;
      this.init();
      this.chunk = null;
      this.id = -1;
    };

    Struct.TYPE = type;

    var key;

    for( key in DefaultElement ){
      Struct.prototype[key] = DefaultElement[key];
    }
    for( key in proto ){
      Struct.prototype[key] = proto[key];
    }

    return Struct;

  };


  module.exports = BaseElement;

}());