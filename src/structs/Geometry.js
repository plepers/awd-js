(function(){
  'use strict';

  var Consts      = require( '../consts' ),
      AwdString   = require( '../types/awdString' ),
      UserAttr    = require( '../types/userAttr' ),
      Properties  = require( '../types/properties' ),
      BaseStruct  = require( './BaseStruct' );


  var Geometry = BaseStruct.createStruct( Consts.GEOMETRY, Consts.DEFAULT_NS,

  {

    subGeomFactory : function() {
      var sg = new SubGeom();
      sg.bufferFactory = this.bufferFactory;
      return sg;
    },


    bufferFactory : function() {
      return new VertexBuffer();
    },


    init : function( ){
      this.model = Consts.MODEL_GEOMETRY;

      this.name = '';
      this.extras = new UserAttr();
      this.subGeoms = [];
    },


    read : function( reader ){

      this.name = AwdString.read( reader );
      var num_subs = reader.U16();

      var geomType = this.awd.header.geoNrType;
      var props = new Properties({
        1: geomType,
        2: geomType
      });

      props.read( reader );

      var geoScaleU = props.get(1, 1);
      var geoScaleV = props.get(2, 1);

      if( geoScaleU !== 1.0 || geoScaleV !== 1 ){
        console.log( 'WARN defined scale UV in geometry' );
      }

      var subGeoms = this.subGeoms;
      var subGeom;

      for (var i = 0; i < num_subs; i++) {

        subGeom =this.subGeomFactory();
        subGeom.read( this.awd, reader );
        subGeoms.push( subGeom );

      }

      this.extras.read( reader );

    },


    write : function( writer ) {
      var subGeoms  = this.subGeoms,
          sgLen     = subGeoms.length;

      AwdString.write( this.name, writer );

      writer.U16( sgLen );

      var geomType = this.awd.header.geoNrType;

      var props = new Properties({
        1: geomType,
        2: geomType
      });
      props.set( 1, 1.0 );
      props.set( 2, 1.0 );
      props.write( writer );

      var subGeom;

      for (var i = 0; i < sgLen; i++) {

        subGeom = subGeoms[i];
        subGeom.write( this.awd, writer );

      }

      this.extras.write( writer );
    },


    toString : function(){
      return '[Geometry ' + this.name + ']';
    }



  } );









  var SubGeom = function(){
    this.buffers = [];
    this.extras = new UserAttr();
  };


  SubGeom.prototype = {

    read : function( awd, reader ) {

      var glen = reader.U32(),
          gend = reader.ptr + glen;

      var geomType = awd.header.geoNrType;
      var props = new Properties({
        1: geomType,
        2: geomType
      });
      props.read( reader );


      var geoScaleU = props.get(1, 1);
      var geoScaleV = props.get(2, 1);

      if( geoScaleU !== 1.0 || geoScaleV !== 1 ){
        console.log( 'WARN defined scale UV in sub-geometry' );
      }

      var buffer;
      var accuracy = awd.header.accuracyGeo;

      var nverts = -1;

      while( reader.ptr < gend ){

        buffer = this.bufferFactory();
        buffer.read( reader, accuracy );

        if( !buffer.isIndex && buffer.numVertices > -1 ) {
          if( nverts > -1 && buffer.numVertices !== nverts) {
            console.log( "Warn buffers in geom has differents num vertices", nverts, buffer.numVertices);
          }
          nverts = buffer.numVertices;
        }

        this.buffers.push( buffer );

      }

      if( nverts === -1 ){
        console.log( "Error, Can't resolve geom buffers sizes");
      }

      // solve size
      for (var i = 0, l = this.buffers.length; i < l; i++) {
        buffer = this.buffers[i];
        if( buffer.numVertices === -1 && !buffer.isIndex ){
          buffer.solveSize( nverts );
        }
      }

      this.extras.read( reader );


    },

    write : function( awd, writer ) {
      var sptr = writer.skipBlockSize();

      this.writeProps( awd, writer );

      var accuracy = awd.header.accuracyGeo;

      for (var i = 0, l = this.buffers.length; i < l; i++) {
        var buffer = this.buffers[i];
        buffer.write( writer, accuracy );
      }

      writer.writeBlockSize( sptr );

      this.extras.write( writer );
    },

    writeProps : function( awd, writer ) {

      var geomType = awd.header.geoNrType;
      //var accuracy = awd.header.accuracyGeo;

      var props = new Properties({
        1: geomType,
        2: geomType
      });
      props.set( 1, 1.0 );
      props.set( 2, 1.0 );

      // if( pad === true ){
      //   // add dummy props to align
      //   // vertex buffer on 4 or 8 bytes
      //   var align = accuracy ? 8 : 4;

      //   // ptr after props and buffer head
      //   //                         prop val    props heads
      //   var basePtr = writer.ptr + 2*align   +    4+12 +          VertexBuffer.HEAD_SIZE;

      //   console.log( "guessed ptr for buffer : ", basePtr );
      //   var diff = align - (basePtr % align);

      //   // need padding
      //   if( diff !== 0 ) {

      //     basePtr += 7; // prop header type 16 + len 32 + val U8
      //     diff = 1 + align - (basePtr % align);

      //     var array = [];
      //     while( diff-- > 0 ){
      //       array.push( 0 );
      //     }

      //     // props.expected[0xFF] = Consts.AWD_FIELD_UINT8;
      //     // props.set( 0xFF, array );

      //   }


      // }

      props.write( writer );

    }

  };





  var POS       = 1,
      IDX       = 2,
      UVS       = 3,
      NRM       = 4,
      TGT       = 5,
      JOIN_IDX  = 6,
      JOIN_WGT  = 7;



  var VertexBuffer = function(){
    this.data = null;
    this.numVertices = -1;

    this.type = 0;
    this.components = 0;
    this.ftype = Consts.T_FLOAT;

    this.isIndex = false;
  };

  VertexBuffer.HEAD_SIZE = 6; // type, ftype, len

  VertexBuffer.prototype = {

    allocate : function( size, ftype, accuracy ){

      var Class = getArray( ftype, accuracy );
      this.data = new Class( size );
    },


    solveSize : function( numVerts ){
      this.numVertices = numVerts;
      this.components = this.data.length / numVerts;
    },


    read : function( reader, accuracy ){
      var str_type  = reader.U8(),
          str_ftype = reader.U8(),
          str_len   = reader.U32(),
          str_end   = reader.ptr + str_len;



      var size = getBufferSize( str_type );

      this.isIndex    = str_type === IDX;
      this.type       = str_type;
      this.components = size;
      this.ftype      = str_ftype;


      var typeSize = getTypeSize( str_ftype, accuracy );
      var numVals = str_len / typeSize;

      if( size !== -1 ){
        this.numVertices = numVals / size;
      }

      this.allocate( numVals, str_ftype, accuracy );


      var read = getReadFunc( str_ftype, accuracy, reader );
      var data = this.data;
      var c = 0;

      while( reader.ptr < str_end ){
        data[c++] = read.call( reader );
      }


    },

    write : function( writer, accuracy ){
      writer.U8( this.type );
      writer.U8( this.ftype );

      var sptr = writer.skipBlockSize();

      var writeFn = getWriteFunc( this.ftype, accuracy, writer );
      var data = this.data;


      for (var i = 0, l = data.length; i < l; i++) {
        writeFn.call( writer, data[i] );
      }

      writer.writeBlockSize( sptr );
    },



  };


  var getTypeSize = function( type, accuracy ){
    if( type === Consts.T_FLOAT ){
      return accuracy ? 8 : 4;
    }
    if( type === Consts.T_SHORT ){
      return 2;
    }
  };

  var getReadFunc = function( type, accuracy, reader ){
    if( type === Consts.T_FLOAT ){
      return accuracy ? reader.F64 : reader.F32;
    }
    if( type === Consts.T_SHORT ){
      return reader.U16;
    }
  };

  var getWriteFunc = function( type, accuracy, writer ){
    if( type === Consts.T_FLOAT ){
      return accuracy ? writer.F64 : writer.F32;
    }
    if( type === Consts.T_SHORT ){
      return writer.U16;
    }
  };


  var getArray = function( type, accuracy ){
    if( type === Consts.T_FLOAT ){
      return accuracy ? Float64Array : Float32Array;
    }
    if( type === Consts.T_SHORT ){
      return Uint16Array;
    }
  };


  var getBufferSize = function( type ){

    switch( type ){

      case POS      :
      case IDX      :
      case NRM      :
      case TGT      :
        return 3;

      case UVS      :
        return 2;

      case JOIN_WGT      :
      case JOIN_IDX      :
        return -1;

      default :
        return -1;
    }

  };


  Geometry.SubGeom        = SubGeom;
  Geometry.VertexBuffer   = VertexBuffer;

  module.exports = Geometry;

})();