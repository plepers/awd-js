(function () {

  var Consts    = require( "../consts" ),
      AwdString = require( "./awdString" ),
      Writer    = require( "../bufferWriter" ),
      Reader    = require( "../bufferReader" );

  var UserAttributes = function(){
    this.attributes = {};
    this._list = [];
  };


  UserAttributes.prototype = {

    clone : function() {
      var writer = new Writer( 64 );
      this.write( writer );
      var copy = new UserAttributes();
      copy.read( new Reader( writer.buffer ) );
      return copy;
    },


    addAttribute : function( name, value, type, ns ){
      var attrib = {
        name : name,
        value : value,
        type : type,
        ns : ns
      };
      this.attributes[ name ] = attrib;
      this._list.push( attrib );
    },

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
              attr_val = reader.readUTFBytes(attr_len); // todo check
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

          this.addAttribute(
            attr_key,
            attr_val,
            attr_type,
            ns_id
          );

          attributes[attr_key] = attr_val;

        }

      }

      return attributes;

    },

    write : function( writer )
    {
      var sptr = writer.skipBlockSize();

      for (var i = 0, l = this._list.length; i < l; i++) {
        var attr = this._list[i];

        var ns_id     = attr.ns,
            attr_key  = attr.name,
            attr_type = attr.type,
            attr_val  = attr.value,
            attr_len;

        writer.U8( ns_id );
        AwdString.write( attr_key, writer );
        writer.U8( attr_type );

        switch (attr_type) {

          case Consts.AWDSTRING:
            attr_len = AwdString.getUTFBytesLength( attr_val );
            writer.U32( attr_len );
            writer.writeUTFBytes(attr_val); //todo hum check
            break;
          case Consts.INT8:
            writer.U32( 1 );
            writer.I8(attr_val);
            break;
          case Consts.INT16:
            writer.U32( 2 );
            writer.I16(attr_val);
            break;
          case Consts.INT32:
            writer.U32( 4 );
            writer.I32(attr_val);
            break;
          case Consts.BOOL:
          case Consts.UINT8:
            writer.U32( 1 );
            writer.U8(attr_val);
            break;
          case Consts.UINT16:
            writer.U32( 2 );
            writer.U16(attr_val);
            break;
          case Consts.UINT32:
          case Consts.BADDR:
            writer.U32( 4 );
            writer.U32(attr_val);
            break;
          case Consts.FLOAT32:
            writer.U32( 4 );
            writer.F32(attr_val);
            break;
          case Consts.FLOAT64:
            writer.U32( 8 );
            writer.F64(attr_val);
            break;
          default:
            throw new Error( "UserAttribute unsupported type" );
        }

      }

      writer.writeBlockSize( sptr );
    }


  };


  module.exports = UserAttributes;

}());