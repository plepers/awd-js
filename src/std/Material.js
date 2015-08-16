(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "types/properties" ),
      AwdString   = require( "types/awdString" ),
      Consts      = require( "consts" ),
      BaseElement = require( 'BaseElement' );

  var Material = BaseElement.createStruct( Consts.MATERIAL, null,

  {

    init : function( ){
      this.name = "";
      this.model = Consts.MODEL_MATERIAL;
    },


    read : function( reader ){
      this.name = AwdString.read( reader );
      this.type = reader.U8();
      this.numMethods = reader.U8();

      var propsNrType = this.awd.header.propsNrType;

      this.props = new Properties({
        1  :Consts.UINT32,
        2  :Consts.BADDR,
        3  :Consts.BADDR,
        4  :Consts.UINT8,
        5  :Consts.BOOL,
        6  :Consts.BOOL,
        7  :Consts.BOOL,
        8  :Consts.BOOL,
        9  :Consts.UINT8,
        10 :propsNrType,
        11 :Consts.BOOL,
        12 :propsNrType,
        13 :Consts.BOOL,
        15 :propsNrType,
        16 :Consts.UINT32,
        17 :Consts.BADDR,
        18 :propsNrType,
        19 :propsNrType,
        20 :Consts.UINT32,
        21 :Consts.BADDR,
        22 :Consts.BADDR
      });

      this.props.read( reader );
    },



    write : function( writer ) {

      AwdString.write( this.name, writer );
      writer.U8( this.type );
      writer.U8( this.numMethods );

      this.props.write( writer );

    },

    toString : function(){

    }



  } );


  module.exports = Material;

}());