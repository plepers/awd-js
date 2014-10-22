(function () {

  var Consts    = require( "../consts" ),
      AwdString = require( "./awdSting" );


  var UserAttributes = {

    read : function( reader )
    {
      var list_len = reader.U32();
      var attributes;

      if (list_len > 0) {
        attributes = {};

        var list_end = reader.ptr + list_len;

        while ( reader.ptr < list_end ) {
          var ns_id     = reader.U8(),
              attr_key  = AwdString.read( reader ),
              attr_type = reader.U8(),
              attr_len  = reader.U32(),
              attr_val;

          switch (attr_type) {

            case Consts.AWDSTRING:
              attr_val = reader.readUTFBytes(attr_len);
              break;
            case Consts.INT8:
              attr_val = reader.I8();
              break;
            case Consts.INT16:
              attr_val = reader.I16();
              break;
            case Consts.INT32:
              attr_val = reader.I32();
              break;
            case Consts.BOOL:
            case Consts.UINT8:
              attr_val = reader.U8();
              break;
            case Consts.UINT16:
              attr_val = reader.U16();
              break;
            case Consts.UINT32:
            case Consts.BADDR:
              attr_val = reader.U32();
              break;
            case Consts.FLOAT32:
              attr_val = reader.F32();
              break;
            case Consts.FLOAT64:
              attr_val = reader.F64();
              break;
            default:
              attr_val = 'unimplemented attribute type ' + attr_type + 'ns : '+ns_id;
              reader.ptr += attr_len;
              break;
          }

          attributes[attr_key] = attr_val;

        }

      }

      return attributes;

    },

    write : function( writer )
    {
      writer.xx();
    }


  };


  module.exports = UserAttributes;

}());