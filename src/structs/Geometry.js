(function(){

  // var Consts = AWD.Consts;


  var Geometry = function(){
    this.name = "";
    this.parent = null;
  };

  Geometry.prototype = {

    read : function( reader ){

      return reader;

    },

    toString : function(){
      return "[Geometry " + this.name + "]";
    }



  };

  AWD.BaseStruct.extend( Geometry.prototype );

  AWD.Geometry = Geometry;

}());