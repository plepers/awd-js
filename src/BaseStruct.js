(function(){

  var Consts      = require( "./consts" ),
      Block       = require( "./block" );


  var DefaultStruct = {

    _setup : function( awd, block ){
      this.awd = awd;
      this.block = block;
      this.id = block.id;
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



      this.prepareBlock();
      list.push( this );

    },

    prepareBlock : function( ){
      if( this.block === null ) {
        this.block = new Block();
      }

      this.block.type = this.type;
      this.block.ns = this.ns;

    }


  };

  var BaseStruct = {};



  BaseStruct.createStruct = function( type, nsUri, proto ){

    var Struct = function(){
      this.type = type;
      this.nsUri = nsUri;
      this.ns = 0;
      this.init();
      this.block = null;
      this.id = -1;
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