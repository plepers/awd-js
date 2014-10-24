(function(){

  var BaseStruct = {

    extend : function( proto ){
      proto.init = _proto.init;

      if( ! proto.getDependencies ) {
        proto.getDependencies = _proto.getDependencies;
      }

      if( ! proto.prepareBlock ) {
        proto.prepareBlock = _proto.prepareBlock;
      }
    }

  };

  var _proto = {

    init : function( awd, block ){
      this.awd = awd;
      this.block = block;
      if( this.pData ) {
        this.pData.struct = this;
      }
    },

    getDependencies : function(){
      return null;
    },

    prepareBlock : function(){

    }

  };


  module.exports = BaseStruct;

}());