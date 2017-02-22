(function(){
  'use strict';

  var Consts      = require( 'consts' ),
      AwdString   = require( 'types/awdString' ),
      UserAttr    = require( 'types/userAttr' ),
      Properties  = require( 'types/properties' ),
      BaseElement = require( 'BaseElement' );


  var Geometry = BaseElement.createStruct( Consts.GEOMETRY, null,

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
      this.props = new Properties({});
      this.subGeoms = [];
    },


    read : function( reader ){

      this.name = AwdString.read( reader );
      var num_subs = reader.U16();

      var geomType = this.awd.header.geoNrType;

      var props = this.props;
      props.expected[1] = geomType;
      props.expected[2] = geomType;

      props.read( reader );

      var geoScaleU = props.get(1, 1);
      var geoScaleV = props.get(2, 1);

      if( geoScaleU !== 1.0 || geoScaleV !== 1 ){
        console.log( 'WARN defined scale UV in geometry' );
      }

      var subGeoms = this.subGeoms;
      var subGeom;

      for (var i = 0; i < num_subs; i++) {

        subGeom = this.subGeomFactory();
        subGeom.read( this.awd, reader );
        subGeoms.push( subGeom );

      }

      this.extras.read( reader );

    },


    write : ( CONFIG_WRITE ) ?
    function( writer ) {
      var subGeoms  = this.subGeoms,
          sgLen     = subGeoms.length;

      AwdString.write( this.name, writer );

      writer.U16( sgLen );

      var geomType = this.awd.header.geoNrType;

      var props = this.props;
      props.expected[1] = geomType;
      props.expected[2] = geomType;

      props.set( 1, 1.0 );
      props.set( 2, 1.0 );
      props.write( writer );

      var subGeom;

      for (var i = 0; i < sgLen; i++) {

        subGeom = subGeoms[i];
        subGeom.write( this.awd, writer );

      }

      this.extras.write( writer );
    }:undefined,


    toString : function(){
      return '[Geometry ' + this.name + ']';
    }



  } );









  var SubGeom = function(){
    this.buffers = [];
    this.extras = new UserAttr();
    this.props = new Properties({});
  };


  SubGeom.prototype = {


    getBuffersByType : function( type, res ){

      if( res === undefined ){
        res = [];
      }
      var i, l;
      if( type instanceof Array ) {
        for ( i = 0, l = type.length; i < l; i++) {
          this.getBuffersByType( type[i], res );
        }
      }
      else {

        for (i = 0, l = this.buffers.length; i < l; i++) {
          if( this.buffers[i].type === type ){
            res.push( this.buffers[i] );
          }
        }

      }
      return res;
    },



    read : function( awd, reader ) {

      var glen = reader.U32(),
          gend = reader.ptr + glen;

      var geomType = awd.header.geoNrType;

      var props = this.props;
      props.expected[1] = geomType;
      props.expected[2] = geomType;

      props.read( reader );


      var geoScaleU = props.get(1, 1);
      var geoScaleV = props.get(2, 1);

      if( geoScaleU !== 1.0 || geoScaleV !== 1 ){
        console.log( 'WARN defined scale UV in sub-geometry' );
      }

      var buffer;

      var nverts = -1;


      while( reader.ptr < gend ){

        buffer = this.bufferFactory();
        buffer.read( reader );

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


      for (var i = 0, l = this.buffers.length; i < l; i++) {
        var buffer = this.buffers[i];
        buffer.write( writer );
      }

      writer.writeBlockSize( sptr );

      this.extras.write( writer );
    },

    writeProps : function( awd, writer ) {

      var geomType = awd.header.geoNrType;
      //var accuracy = awd.header.accuracyGeo;


      var props = this.props;
      props.expected[1] = geomType;
      props.expected[2] = geomType;

      props.set( 1, 1.0 );
      props.set( 2, 1.0 );


      props.write( writer );

    }

  };





  //
  // C4D exporter bug
  // https://github.com/awaytools/AwayExtensions-C4D/pull/3

  var fixC4D_Type = function( val ){
    if( val === 2 ){
      return Consts.AWD_FIELD_UINT16;
    }
    // else if( val === 4 ){
    //   return Consts.AWD_FIELD_FLOAT32;
    // }
    return val;
  };




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

    allocate : function( size, ftype){

      var Class = getArray( ftype );
      if( Class === undefined ){
        console.log( ftype );
      }
      this.data = new Class( size );
    },


    solveSize : function( numVerts ){
      this.numVertices = numVerts;
      this.components = this.data.length / numVerts;
    },


    read : function( reader ){
      var str_type  = reader.U8(),
          str_ftype = reader.U8(),
          str_len   = reader.U32(),
          str_end   = reader.ptr + str_len;

      str_ftype = fixC4D_Type( str_ftype );
      if( str_ftype !== Consts.AWD_FIELD_UINT8 &&
          str_ftype !== Consts.AWD_FIELD_UINT16 &&
          str_ftype !== Consts.AWD_FIELD_FLOAT32 &&
          str_ftype !== Consts.AWD_FIELD_FLOAT64 ) {
        console.log( "WARN unexpected stream data type ", str_ftype, str_type, str_len );
      }

      var size = getBufferSize( str_type );
      
      this.isIndex    = str_type === Consts.INDEX;
      this.type       = str_type;
      this.components = size;
      this.ftype      = str_ftype;


      var typeSize = getTypeSize( str_ftype );
      var numVals = str_len / typeSize;

      if( size !== -1 ){
        this.numVertices = numVals / size;
      }

      this.allocate( numVals, str_ftype );


      var read = getReadFunc( str_ftype, reader );
      var data = this.data;
      var c = 0;

      while( reader.ptr < str_end ){
        data[c++] = read.call( reader );
      }


    },

    write : function( writer ){
      writer.U8( this.type );
      writer.U8( this.ftype );

      var sptr = writer.skipBlockSize();

      var writeFn = getWriteFunc( this.ftype, writer );
      var data = this.data;


      for (var i = 0, l = data.length; i < l; i++) {
        writeFn.call( writer, data[i] );
      }

      writer.writeBlockSize( sptr );
    },



  };


  var getTypeSize = function( type ){
    switch( type ){
      case Consts.AWD_FIELD_UINT8 :
        return 1;
      case Consts.AWD_FIELD_UINT16 :
        return 2;
      case Consts.AWD_FIELD_FLOAT32 :
        return 4;
      case Consts.AWD_FIELD_FLOAT64 :
        return 8;
    }
    throw new Error( "WARN getTypeSize - unexpected stream data type "+ type );
  };

  var getReadFunc = function( type, reader ){
    switch( type ){

      case Consts.AWD_FIELD_UINT8 :
        return reader.U8;
      case Consts.AWD_FIELD_UINT16 :
        return reader.U16;
      case Consts.AWD_FIELD_FLOAT32 :
        return reader.F32;
      case Consts.AWD_FIELD_FLOAT64 :
        return reader.F64;
    }
    throw new Error( "WARN getReadFunc - unexpected stream data type "+ type );

  };

  var getWriteFunc = function( type, writer ){
    switch( type ){

      case Consts.AWD_FIELD_UINT8 :
        return writer.U8;
      case Consts.AWD_FIELD_UINT16 :
        return writer.U16;
      case Consts.AWD_FIELD_FLOAT32 :
        return writer.F32;
      case Consts.AWD_FIELD_FLOAT64 :
        return writer.F64;
    }
    throw new Error( "WARN getWriteFunc - unexpected stream data type "+ type );

  };


  var getArray = function( type ){

    switch( type ){

      case Consts.AWD_FIELD_UINT8 :
        return Uint8Array;
      case Consts.AWD_FIELD_UINT16 :
        return Uint16Array;
      case Consts.AWD_FIELD_FLOAT32 :
        return Float32Array;
      case Consts.AWD_FIELD_FLOAT64 :
        return Float64Array;
    }
    throw new Error( "WARN getArray - unexpected stream data type "+ type );

  };


  var getBufferSize = function( type ){

    switch( type ){

      case Consts.POSITION   :
      case Consts.INDEX      :
      case Consts.NORMAL     :
      case Consts.TANGENT    :
      case Consts.BINORMAL   :
        return 3;

      case Consts.UVS      :
        return 2;

      case Consts.JOIN_WGT      :
      case Consts.JOIN_IDX      :
        return -1;

      default :
        return -1;
    }

  };


  Geometry.SubGeom        = SubGeom;
  Geometry.VertexBuffer   = VertexBuffer;

  Geometry.getTypeSize  = getTypeSize;
  Geometry.getReadFunc  = getReadFunc;
  Geometry.getWriteFunc = getWriteFunc;
  Geometry.getArray     = getArray;
  Geometry.fixC4D_Type  = fixC4D_Type;

  module.exports = Geometry;

})();