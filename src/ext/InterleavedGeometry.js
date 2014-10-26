var Ext         = require( './ext' ),
    BaseGeom    = require( '../structs/Geometry' ),
    BaseStruct  = require( '../structs/BaseStruct' ),
    BufferReader= require( '../bufferReader' ),
    Consts      = require( '../consts' );




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




var VertexBuffer = function(){
  this.data = null;
  this.attributes = [];
  this.ftype = Consts.T_FLOAT;
};

VertexBuffer.HEAD_SIZE = 6; // type, ftype, len

VertexBuffer.prototype = {

  allocate : function( len, ftype, accuracy ){
    var Class = getArray( ftype, accuracy );
    this.data = new Class( len );
  },

/*
num attr
vert size
  type : pos
  len : 3
  type : uvs
  len : 2
  type : nrm
  len : 3
*/

  read : function( reader, accuracy ){
    var num_attr  = reader.U8(),
        str_ftype = reader.U8(),
        attribs   = this.attributes;

    this.ftype = str_ftype;

    var vSize = 0;

    for (var i = 0; i < num_attr; i++) {
      var type = reader.U8(),
          len  = reader.U8();

      vSize += len;

      attribs.push( {
        type : type,
        len : len
      } );
    }

    var padding   = reader.U8();
    reader.ptr += padding;


    var str_len   = reader.U32(),
        str_end   = reader.ptr + str_len;


    var typeSize = getTypeSize( str_ftype );
    var numVals = str_len / typeSize;

    this.numVertices = numVals / vSize;

    this.allocate( numVals, str_ftype, accuracy );

    var read = getReadFunc( str_ftype, accuracy, reader );
    var data = this.data;
    var c = 0;

    while( reader.ptr < str_end ){
      data[c++] = read.call( reader );
    }


  },

  write : function( writer, accuracy ){
    var attribs = this.attributes,
        i, l;

    writer.U8( attribs.length );
    writer.U8( this.ftype );





    for ( i = 0, l = attribs.length; i < l; i++) {
      var attr = attribs[i];
       writer.U8( attr.type );
       writer.U8( attr.len );
    }

    // align to 4 or 8 bytes
    // take in account u32 str_len
    var tsize = getTypeSize( this.ftype, accuracy );
    var pad = tsize - ((writer.ptr+5) % tsize);
    writer.U8( pad );
    for( i = 0; i< pad; i++){
      writer.U8( 0 );
    }



    var sptr = writer.skipBlockSize();

    var writeFn = getWriteFunc( this.ftype, accuracy, writer );
    var data = this.data;

    // console.log( "write i buffer , data len : ", writer.ptr%4 );


    for ( i = 0, l = data.length; i < l; i++) {
      writeFn.call( writer, data[i] );
    }

    writer.writeBlockSize( sptr );
  },



};


//
// her we convert classic buffer to fewer interleaved ones
//
var convertSubGeom = function( geom, accuracy ) {

  var res = new BaseGeom.SubGeom();
  res.extras = geom.extras.clone();

  //
  var buffers = geom.buffers;

  var byTypes = {};
  var ftype, buf;
  var buffer;

  for (var i = 0, l = buffers.length; i < l; i++) {
    buf = buffers[i];

    // skip index buffer
    if( buf.type === 2 ) {

      buffer = new VertexBuffer();
      buffer.attributes.push({
        type: 2,
        len:3
      });

      // todo copy
      buffer.data = buf.data;
      buffer.ftype = Consts.T_SHORT;
      res.buffers.push( buffer );

      continue;
    }

    ftype = buf.ftype;

    if( ! byTypes[ftype] ) {
      byTypes[ftype] = {
        list : [],
        ftype : ftype
      };
    }

    byTypes[ftype].list.push( buf );

  }


  for( var key in byTypes ) {

    var list = byTypes[key].list;
    var nVerts = list[0].numVertices;

    ftype = byTypes[key].ftype;

    buffer = new VertexBuffer();
    res.buffers.push( buffer );
    buffer.ftype = ftype;

    var readers = [];
    var j;

    console.log( "add i buffers ftype ", key );

    for ( i = 0, l = list.length; i < l; i++) {


      buf = list[i];
      var reader = new BufferReader( buf.data.buffer );

      console.log( "      buffer type ", buf.type );

      buffer.attributes.push({
        type : buf.type,
        len : buf.components,
      });

      for( j = 0; j < buf.components; j++) {
        readers.push( reader );
      }

    }


    var Class = getArray( ftype );
    var data = new Class( readers.length * nVerts );
    var read_func = getReadFunc( ftype, accuracy, readers[0] );

    var c = 0;

    console.log( "  nverts / readers", nVerts, readers.length );

    for ( i = 0; i < nVerts; i++) {

      for ( j = 0, l = readers.length; j < l; j++) {
        data[c++] = read_func.call( readers[j] );
      }

    }

    buffer.data =  data;

  }

  return res;

};



var Geometry = BaseStruct.createStruct(
  Ext.INTERLEAVED_GEOM,
  Ext.NS,
  BaseGeom.prototype
);

Geometry.prototype.fromGeometry = function( g, accuracy ) {
  this.name = g.name;
  this.extras = g.extras.clone();

  for (var i = 0, l = g.subGeoms.length; i < l; i++) {
    var sg = g.subGeoms[i];

    this.subGeoms.push( convertSubGeom( sg, accuracy ) );
  }
};

Geometry.prototype.subGeomFactory = function() {
  var sg = BaseGeom.prototype.subGeomFactory();
  sg.bufferFactory = this.bufferFactory;
  return sg;
};


Geometry.prototype.bufferFactory = function() {
  console.log( "create I buffer " );
  return new VertexBuffer();
};


Geometry.prototype.toString = function(){
  return '[InterleavedGeometry ' + this.name + ']';
};




module.exports = Geometry;