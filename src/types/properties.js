(function () {

  var Consts    = require( "consts" ),
      awdString = require( 'types/awdString' ),
      Writer    = require( "bufferWriter" ),
      Reader    = require( "bufferReader" );

  var Properties = function( expected ) {

    this.expected = expected;
    this.vars = {};

  };

  Properties.prototype = {


    clone : function() {
      var writer = new Writer( 64 );
      this.write( writer );
      var copy = new Properties( this.expected ); // todo also clone expected
      copy.read( new Reader( writer.buffer ) );
      return copy;
    },


    read : function( reader )
    {
      var expected = this.expected;
      var list_len = reader.U32();
      var list_end = reader.ptr + list_len;

      if( expected ) {

        while( reader.ptr < list_end ) {

          var key = reader.U16();
          var len = reader.U32();
          var type;

          if( this.expected.hasOwnProperty( key ) ) {
            type = expected[ key ];
            this.set( key, this.parseAttrValue( type, len, reader ) );
          } else {
            reader.ptr += len;
          }
        }

      }

      if( reader.ptr !== list_end ) {
        console.log( "Warn Properties don't read entire data ", reader.ptr, list_end , list_len);
        reader.ptr = list_end;
      }


    },

    write : ( CONFIG_WRITE ) ?
    function( writer )
    {

      var sptr = writer.skipBlockSize();

      var vars = this.vars;

      for( var key in vars ){

        var type = this.expected[ key ];
        var val = vars[key];

        writer.U16( key );
        this.writeAttrValue( type, val, writer );
      }

      writer.writeBlockSize( sptr );

      //writer.U32( 0 ); //todo don't know why

    } : undefined,

    set : function(key, value)
    {
      this.vars[key] = value;
    },

    get : function(key, fallback)
    {
      if ( this.vars.hasOwnProperty(key) ) {
        return this.vars[key];
      }
      else {
        return fallback;
      }
    },


    writeAttrValue : ( CONFIG_WRITE ) ?
    function ( type, value, writer ) {
      var elem_len;
      var write_func;

      switch (type) {
        case Consts.AWD_FIELD_INT8:
          elem_len = 1;
          write_func = writer.I8;
          break;
        case Consts.AWD_FIELD_INT16:
          elem_len = 2;
          write_func = writer.I16;
          break;
        case Consts.AWD_FIELD_INT32:
          elem_len = 4;
          write_func = writer.I32;
          break;
        case Consts.AWD_FIELD_BOOL:
        case Consts.AWD_FIELD_UINT8:
          elem_len = 1;
          write_func = writer.U8;
          break;
        case Consts.AWD_FIELD_UINT16:
          elem_len = 2;
          write_func = writer.U16;
          break;
        case Consts.AWD_FIELD_UINT32:
        case Consts.AWD_FIELD_BADDR:
          elem_len = 4;
          write_func = writer.U32;
          break;
        case Consts.AWD_FIELD_FLOAT32:
          elem_len = 4;
          write_func = writer.F32;
          break;
        case Consts.AWD_FIELD_FLOAT64:
          elem_len = 8;
          write_func = writer.F64;
          break;
        case Consts.AWD_FIELD_STRING:
          writer.U32( awdString.getUTFBytesLength( value ) );
          // writer.U16( value.length ); // unexpected
          writer.writeUTFBytes( value );
          return;

        case Consts.AWD_FIELD_VECTOR2x1:
        case Consts.AWD_FIELD_VECTOR3x1:
        case Consts.AWD_FIELD_VECTOR4x1:
        case Consts.AWD_FIELD_MTX3x2:
        case Consts.AWD_FIELD_MTX3x3:
        case Consts.AWD_FIELD_MTX4x3:
        case Consts.AWD_FIELD_MTX4x4:
          elem_len = 8;
          write_func = writer.F64;
          break;
      }

      if ( value instanceof Array ) {
        writer.U32( value.length * elem_len );

        for (var i = 0, l = value.length; i < l; i++) {
          write_func.call( writer, value[i] );
        }

      }
      else {
        writer.U32( elem_len );
        write_func.call( writer, value );
      }
    } : undefined,


    parseAttrValue : function ( type, len, reader ) {

      var elem_len;
      var read_func;

      switch (type) {
        case Consts.AWD_FIELD_INT8:
          elem_len = 1;
          read_func = reader.I8;
          break;
        case Consts.AWD_FIELD_INT16:
          elem_len = 2;
          read_func = reader.I16;
          break;
        case Consts.AWD_FIELD_INT32:
          elem_len = 4;
          read_func = reader.I32;
          break;
        case Consts.AWD_FIELD_BOOL:
        case Consts.AWD_FIELD_UINT8:
          elem_len = 1;
          read_func = reader.U8;
          break;
        case Consts.AWD_FIELD_UINT16:
          elem_len = 2;
          read_func = reader.U16;
          break;
        case Consts.AWD_FIELD_UINT32:
        case Consts.AWD_FIELD_BADDR:
          elem_len = 4;
          read_func = reader.U32;
          break;
        case Consts.AWD_FIELD_FLOAT32:
          elem_len = 4;
          read_func = reader.F32;
          break;
        case Consts.AWD_FIELD_FLOAT64:
          elem_len = 8;
          read_func = reader.F64;
          break;
        case Consts.AWD_FIELD_STRING:
          // unexpected U16 len field
          // produced by Prefab exporter
          var len2 = reader.U16();
          if( len2 === len ) {
            console.log( "WARN may be Prefab bug / String property bug!!" );
          }
          reader.ptr -= 2;

          var s = reader.readUTFBytes( len );
          return s;

        case Consts.AWD_FIELD_VECTOR2x1:
        case Consts.AWD_FIELD_VECTOR3x1:
        case Consts.AWD_FIELD_VECTOR4x1:
        case Consts.AWD_FIELD_MTX3x2:
        case Consts.AWD_FIELD_MTX3x3:
        case Consts.AWD_FIELD_MTX4x3:
        case Consts.AWD_FIELD_MTX4x4:
          elem_len = 8;
          read_func = reader.F64;
          break;
      }

      if (elem_len < len) {
        var list;
        var num_read;
        var num_elems;

        list = [];
        num_read = 0;
        num_elems = len / elem_len;

        while (num_read < num_elems) {
          list.push(read_func.call( reader ) );
          num_read++;
        }

        return list;
      }
      else {
        return read_func.call( reader );
      }

    }


  };


  module.exports = Properties;

}());