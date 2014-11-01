
var DefaultElement = require( './DefaultElement' ),
    Namespace     = require( './std/Namespace' );


var Extention = function( nsUri ){
  this.nsUri    = nsUri;
  this.structs  = [];
  this.nsId     = 0;
};


Extention.prototype = {

  addStruct : function( struct ){
    this.structs.push( struct );
  },

  addStructs : function( structs ){
    for (var i = 0, l = structs.length; i < l; i++) {
      this.addStruct( structs[i] );
    }
  },

  create : function( type ){

    var structs = this.structs,
        Struct;

    for (var i = 0, l = structs.length; i < l; i++) {
      Struct = structs[i];
      if( Struct.TYPE === type ) {
        return new Struct();
      }
    }

    return new DefaultElement();
  },

  createNamespace : function() {
    var ns = new Namespace();
    ns.uri = this.nsUri;
    return ns;
  }

};


module.exports = Extention;