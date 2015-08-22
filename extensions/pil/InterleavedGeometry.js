var awdjs = require( 'libawd' ),
    BaseElement  = awdjs.BaseElement,
    BufferReader = awdjs.bufferReader,
    Consts       = awdjs.consts;

var BaseGeom = require( 'std/Geometry' );

var ExtInfos     = require( 'pil/extInfos' );



var VertexBuffer = function(){
  this.data = null;
  this.attributes = [];
  this.ftype = Consts.AWD_FIELD_FLOAT32;
};

VertexBuffer.HEAD_SIZE = 6; // type, ftype, len

VertexBuffer.prototype = {

  allocate : function( len, ftype ){
    var Class = BaseGeom.getArray( ftype );
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

  read : function( reader ){

    var num_attr  = reader.U8(),
        str_ftype = reader.U8(),
        attribs   = this.attributes;

    this.ftype = str_ftype;

    var vSize = 0;
    this.isIndex = false;

    for (var i = 0; i < num_attr; i++) {
      var type = reader.U8(),
          len  = reader.U8();

      // index buff
      if( type === Consts.INDEX ){
        if( num_attr > 1 ){
          console.warn( "interleaved index buffer is not alone" );
        }
        this.isIndex = true;
      }

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


    var typeSize = BaseGeom.getTypeSize( str_ftype );
    var numVals = str_len / typeSize;

    this.numVertices = numVals / vSize;

    this.allocate( numVals, str_ftype );

    var read = BaseGeom.getReadFunc( str_ftype, reader );
    var data = this.data;
    var c = 0;

    while( reader.ptr < str_end ){
      data[c++] = read.call( reader );
    }


  },

  write : ( CONFIG_WRITE ) ?
    function( writer ){

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
    var tsize = BaseGeom.getTypeSize( this.ftype );
    var pad = tsize - ((writer.ptr+5) % tsize);
    writer.U8( pad );
    for( i = 0; i< pad; i++){
      writer.U8( 0 );
    }



    var sptr = writer.skipBlockSize();

    var writeFn = BaseGeom.getWriteFunc( this.ftype, writer );
    var data = this.data;

    // console.log( "write i buffer , data len : ", writer.ptr%4 );


    for ( i = 0, l = data.length; i < l; i++) {
      writeFn.call( writer, data[i] );
    }

    writer.writeBlockSize( sptr );
  } : undefined,



};


//
// her we convert classic buffer to fewer interleaved ones
//
var convertSubGeom = function( geom ) {

  var res = new BaseGeom.SubGeom();
  res.extras  = geom.extras.clone();
  res.props   = geom.props.clone();

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
      buffer.ftype = Consts.AWD_FIELD_UINT16;
      buffer.isIndex = true;
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

    for ( i = 0, l = list.length; i < l; i++) {


      buf = list[i];
      var reader = new BufferReader( buf.data.buffer );
      buffer.attributes.push({
        type : buf.type,
        len : buf.components,
      });

      for( j = 0; j < buf.components; j++) {
        readers.push( reader );
      }

    }


    var Class = BaseGeom.getArray( ftype );
    var data = new Class( readers.length * nVerts );
    var read_func = BaseGeom.getReadFunc( ftype, readers[0] );

    var c = 0;

    for ( i = 0; i < nVerts; i++) {

      for ( j = 0, l = readers.length; j < l; j++) {
        data[c++] = read_func.call( readers[j] );
      }

    }

    buffer.data =  data;

  }

  return res;

};



var Geometry = BaseElement.createStruct(
  ExtInfos.INTERLEAVED_GEOM,
  ExtInfos.URI,
  BaseGeom.prototype
);

Geometry.prototype.fromGeometry = function( g ) {
  this.name = g.name;
  this.extras = g.extras.clone();
  this.props = g.props.clone();

  for (var i = 0, l = g.subGeoms.length; i < l; i++) {
    var sg = g.subGeoms[i];

    this.subGeoms.push( convertSubGeom( sg ) );
  }
};

Geometry.prototype.subGeomFactory = function() {
  var sg = BaseGeom.prototype.subGeomFactory();
  sg.bufferFactory = this.bufferFactory;
  return sg;
};


Geometry.prototype.bufferFactory = function() {
  return new VertexBuffer();
};


Geometry.prototype.toString = function(){
  return '[InterleavedGeometry ' + this.name + ']';
};




module.exports = Geometry;