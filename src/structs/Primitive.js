(function(){

  // var Consts = AWD.Consts;


  var Primitive = function(){
    this.name = "";
    this.type = 0;
  };

  Primitive.prototype = {

    read : function( reader ){
      this.name = AWD.Parser.parseVarString();
      this.type = reader.U8();
      this.props = new AWD.Properties();
      this.props.read( reader );
    },

    toString : function(){

    }



  };

  AWD.BaseStruct.extend( Primitive.prototype );

  AWD.Primitive = Primitive;

}());