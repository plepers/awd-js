(function(){
  'use strict';

  var Consts      = require( '../consts' ),
      AwdString   = require( '../types/awdString' ),
      UserAttr    = require( '../types/userAttr' ),
      Properties  = require( '../types/properties' ),
      BaseStruct  = require( './BaseStruct' );


  var Geometry = BaseStruct.createStruct( Consts.GEOMETRY, Consts.DEFAULT_NS,

  {

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

        subGeom = new SubGeom();
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

      while( reader.ptr < gend ){

        buffer = new VertexBuffer();
        buffer.read( reader, accuracy );
        this.buffers.push( buffer );

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

  var T_FLOAT = 4,
      T_SHORT = 2;



  var BufferInfos = {

    position : {
      name: 'position',
      type: POS,
      size: 3,
      ftype: T_FLOAT
    },

    indices : {
      name: 'index',
      type: IDX,
      size: 3,
      ftype: T_SHORT
    },

    uvs : {
      name: 'uv',
      type: UVS,
      size: 2,
      ftype: T_FLOAT
    },

    normals : {
      name: 'normal',
      type: NRM,
      size: 3,
      ftype: T_FLOAT
    },

    tangents : {
      name: 'tangent',
      type: TGT,
      size: 3,
      ftype: T_FLOAT
    },

    join_indices : {
      name: 'join_index',
      type: TGT,
      size: -1,
      ftype: T_SHORT
    },

    join_weight : {
      name: 'join_weight',
      type: TGT,
      size: -1,
      ftype: T_FLOAT
    },


  };




  var VertexBuffer = function(){
    this.data = null;
    this.length = 0;
    this.size = 0;
    this.infos = null;
  };

  VertexBuffer.HEAD_SIZE = 6; // type, ftype, len

  VertexBuffer.prototype = {

    allocate : function( numVerts, infos ){
      this.length = numVerts;
      this.size = ( infos.size > 0 ) ? infos.size : 1;

      var Class = getArray( infos.ftype );
      this.data = new Class( numVerts * this.size );
    },


    read : function( reader, accuracy ){
      var str_type  = reader.U8(),
          str_ftype = reader.U8(),
          str_len   = reader.U32(),
          str_end   = reader.ptr + str_len;


      var infos = getBufferInfos( str_type );
      this.infos = infos;

      if( infos.ftype !== str_ftype ) {
        console.log( 'SubGeom str_ftype mismatch :' + str_ftype );
      }

      var numVerts = getNumVerts( str_len, accuracy, infos );
      this.allocate( numVerts, infos );


      var read = getReadFunc( infos.ftype, accuracy, reader );
      var data = this.data;
      var c = 0;

      while( reader.ptr < str_end ){
        data[c++] = read.call( reader );
      }


    },

    write : function( writer, accuracy ){
      var infos = this.infos;

      writer.U8( infos.type );
      writer.U8( infos.ftype );

      var sptr = writer.skipBlockSize();

      var writeFn = getWriteFunc( infos.ftype, accuracy, writer );
      var data = this.data;


      for (var i = 0, l = data.length; i < l; i++) {
        writeFn.call( writer, data[i] );
      }

      writer.writeBlockSize( sptr );
    },



  };

    var getReadFunc = function( type, accuracy, reader ){
    if( type === T_FLOAT ){
      return accuracy ? reader.F64 : reader.F32;
    }
    if( type === T_SHORT ){
      return reader.U16;
    }
  };

  var getWriteFunc = function( type, accuracy, writer ){
    if( type === T_FLOAT ){
      return accuracy ? writer.F64 : writer.F32;
    }
    if( type === T_SHORT ){
      return writer.U16;
    }
  };


  var getNumVerts = function( byteLength, accuracy, infos ){

    var size = ( infos.size > 0 ) ? infos.size : 1;
    var type = infos.ftype;

    if( type === T_FLOAT ){
      var perComp = accuracy ? 8 : 4;
      return byteLength / perComp / size;
    }
    if( type === T_SHORT ){
      return byteLength / 2 / size;
    }
  };

  var getArray = function( type ){
    if( type === T_FLOAT ){
      return Float64Array;
    }
    if( type === T_SHORT ){
      return Uint16Array;
    }
  };


  var getBufferInfos = function( type ){

    switch( type ){
      case POS      :
        return BufferInfos.position;
      case IDX      :
        return BufferInfos.indices;
      case UVS      :
        return BufferInfos.uvs;
      case NRM      :
        return BufferInfos.normals;
      case TGT      :
        return BufferInfos.tangents;
      case JOIN_IDX :
        return BufferInfos.join_indices;
      case JOIN_WGT :
        return BufferInfos.join_weight;
    }

  };


  module.exports = Geometry;

})();