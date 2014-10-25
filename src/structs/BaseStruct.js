(function(){

  var BaseStruct = {};



  var _structSetup = function( awd, block ){
    this.awd = awd;
    this.block = block;
  };

  var getDependencies = function(){
    return null;
  };

  var prepareBlock = function(){

  };

  var init = function(){

  };


  BaseStruct.createStruct = function( type, ns, proto ){

    var Struct = function(){
      this.type = type;
      this.ns = ns;
      this.init();
    };

    Struct.TYPE = type;

    Struct.prototype._setup           = _structSetup;
    Struct.prototype.getDependencies  = getDependencies;
    Struct.prototype.prepareBlock     = prepareBlock;
    Struct.prototype.init             = init;

    for( var key in proto ){
      Struct.prototype[key] = proto[key];
    }

    return Struct;

  };


  module.exports = BaseStruct;

}());