(function ( AWD ){

  var Consts = AWD.Consts;


  var parseVarString = function( reader ) {
    var l = reader.U16();
    return reader.readUTFBytes( l );
  };

  var parseUserAttributes = function( reader ) {
    var list_len = reader.U32();
    var attributes;

    if (list_len > 0) {
      attributes = {};

      var list_end = reader.ptr + list_len;

      while ( reader.ptr < list_end ) {
        var ns_id     = reader.U8(),
            attr_key  = parseVarString( reader ),
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

  };

  var Parser = {

    parse : function( buffer, awd ){

      var reader = new AWD.BufferReader( buffer );

      awd.header.read( reader );

      var block;

      while( reader.bytesAvailable() > 0 ) {
        block = new AWD.Block();
        block.read( reader );
        block.parseData( awd );
        awd.addBlock( block );

        console.log( block.type, block.id, ( block.data !== null ) ? block.data.toString() : 'null' );
      }


    },

    parseVarString : parseVarString,

    parseUserAttributes : parseUserAttributes

  };



  AWD.Parser = Parser;


}( AWD ));