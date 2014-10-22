(function(){

  var BaseStruct = {

    extend : function( proto ){
      proto.init = _proto.init;
    },

  };

  var _proto = {

    init : function( awd ){
      this.awd = awd;
      this.pData = null;
    }

  };


  module.exports = BaseStruct;

}());