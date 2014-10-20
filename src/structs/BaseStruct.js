(function(){

  //var Consts = AWD.Consts;

  var BaseStruct = {

    extend : function( proto ){
      proto.init = _proto.init;
    },

  };

  var _proto = {

    init : function( awd ){
      this.awd = awd;
    }

  };


  AWD.BaseStruct = BaseStruct;

}());