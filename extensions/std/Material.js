(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "types/properties" ),
      AwdString   = require( "types/awdString" ),
      Consts      = require( "consts" ),
      UserAttr    = require( "types/userAttr" ),
      BaseElement = require( 'BaseElement' );

  var Material = BaseElement.createStruct( Consts.MATERIAL, null,

  {

    init : function( ){
      this.name = "";
      this.model = Consts.MODEL_MATERIAL;
      this.extras = new UserAttr();
    },


    read : function( reader ){
      this.name = AwdString.read( reader );
      this.mattype = reader.U8();
      this.numMethods = reader.U8();

      var propsNrType = this.awd.header.propsNrType;

      this.props = new Properties({
        1  :Consts.AWD_FIELD_UINT32,
        2  :Consts.AWD_FIELD_BADDR,
        3  :Consts.AWD_FIELD_BADDR,
        4  :Consts.AWD_FIELD_UINT8,
        5  :Consts.AWD_FIELD_BOOL,
        6  :Consts.AWD_FIELD_BOOL,
        7  :Consts.AWD_FIELD_BOOL,
        8  :Consts.AWD_FIELD_BOOL,
        9  :Consts.AWD_FIELD_UINT8,
        10 :propsNrType,
        11 :Consts.AWD_FIELD_BOOL,
        12 :propsNrType,
        13 :Consts.AWD_FIELD_BOOL,
        15 :propsNrType,
        16 :Consts.AWD_FIELD_UINT32,
        17 :Consts.AWD_FIELD_BADDR,
        18 :propsNrType,
        19 :propsNrType,
        20 :Consts.AWD_FIELD_UINT32,
        21 :Consts.AWD_FIELD_BADDR,
        22 :Consts.AWD_FIELD_BADDR
      });

      this.props.read( reader );
      this.extras.read( reader );
    },



    write : ( CONFIG_WRITE ) ?
    function( writer ) {

      AwdString.write( this.name, writer );
      writer.U8( this.mattype );
      writer.U8( this.numMethods );

      this.props.write( writer );
      this.extras.write( writer );

    }:undefined,

    toString : function(){

    }



  } );


  module.exports = Material;

}());