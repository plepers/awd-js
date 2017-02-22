var BaseElement  = require( '../../src/BaseElement' ),
    AwdString    = require( '../../src/types/awdString' ),
    Consts       = require( '../../src/consts' );

var BaseGeom     = require( '../std/Geometry' );

var ExtInfos     = require( './extInfos' );


var GL_ARRAY_BUFFER           = 34962,
    GL_ELEMENT_ARRAY_BUFFER   = 34963,
    GL_FLOAT                  = 5126,
    GL_UNSIGNED_SHORT         = 5123,
    GL_UNSIGNED_BYTE          = 5121,
    GL_UNSIGNED_INT           = 5125;




// ===============================
//                  Attribute
// ===============================
/*
AWDStr  name
U8      bytesize
U16     gltype
U8      b4 normalize + b3-0 num comps
*/

function Attribute(){
  this.name      = '';
  this.bytesize  = 0;
  this.gltype    = 0;
  this.numcomps  = 0;
  this.normalize = false;
}


Attribute.prototype = {

  read : function( reader ){

    this.name = AwdString.read( reader );
    this.bytesize = reader.U8();
    this.gltype   = reader.U16();

    var buf = reader.U8();
    this.numcomps  = buf & 7;
    this.normalize = !!((buf >>> 3) & 1);

  },


  write : ( CONFIG_WRITE ) ?
    function( writer ){

    AwdString.write( this.name, writer );

    writer.U8( this.bytesize );
    writer.U16( this.gltype );

    var buf = (this.numcomps & 7);
    if( this.normalize ){
      buf = buf | 8;
    }

    writer.U8( buf );

  } : undefined,

};



// ===============================
//                  BUFFER
// ===============================
/*
U8      num attributes
U16     gl buffertype 
attr*   attributes
U8      padding
...     pad
U32     data len
byte[]  data
*/

var VertexBuffer = function(){
  this.data       = null;
  this.buffertype = GL_ARRAY_BUFFER;
  this.attributes = [];
};


VertexBuffer.Attribute = Attribute;


VertexBuffer.prototype = {


  read : function( reader ){

    var num_attr  = reader.U8(),
        btype     = reader.U16(),
        attribs   = this.attributes;

    this.buffertype = btype;


    for (var i = 0; i < num_attr; i++) {
      var attrib = new Attribute();
      attrib.read( reader );
      attribs.push( attrib );
    }

    var padding   = reader.U8();
    reader.ptr += padding;


    var str_len   = reader.U32(),
        str_end   = reader.ptr + str_len;

    this.data = new Uint8Array( reader.buffer, reader.ptr, str_len );
    reader.ptr = str_end;

  },


  write : ( CONFIG_WRITE ) ?
    function( writer ){

    var attribs = this.attributes,
        i, l;

    writer.U8(  attribs.length );
    writer.U16( this.buffertype );


    for ( i = 0, l = attribs.length; i < l; i++) {
      var attr = attribs[i];
      attr.write( writer );
    }

    // always align to 4 bytes
    // take in account u32 str_len
    var tsize = 4;
    var pad = tsize - ((writer.ptr+5) % tsize);
    writer.U8( pad );
    for( i = 0; i< pad; i++){
      writer.U8( 0 );
    }




    writer.U32( this.data.byteLength );
    writer.writeSub( this.data );

  } : undefined,



};




var streamName = function( type ){
  switch( type ) {
    case Consts.POSITION :
      return 'aPosition';
    case Consts.UVS :
      return 'aTexCoord';
    case Consts.NORMAL :
      return 'aNormal';
    case Consts.TANGENT :
      return 'aTangent';
    case Consts.JOIN_IDX :
      return 'join_index';
    case Consts.JOIN_WGT :
      return 'join_weight';
    case Consts.SUVS :
      return 'aTexCoord1';
    case Consts.COLOR :
      return 'aColor';
    case Consts.BINORMAL :
      return 'aBitangent';
  }
  return null;
};



function ensureUint8( array ){
  return new Uint8Array( array.buffer, array.offset, array.byteLength );
}

function compactShort( array ){
  if( array.BYTES_PER_ELEMENT === 2 ){
    var i;

    for ( i = 0; i < array.length; i++) {
      if( array[i] > 0xFF ){
        return array;
      } 
    }

    var res = new Uint8Array( array.length );
    for ( i = 0; i < array.length; i++) {
      res[i] = array[i];
    }


  }
  
  return array;
  
}

//
// her we convert classic buffer to fewer interleaved ones
//
var convertSubGeom = function( geom ) {

  var res = new BaseGeom.SubGeom();
  res.extras  = geom.extras.clone();
  res.props   = geom.props.clone();

  //
  var buffers = geom.buffers;

  var attrib, buf, i, l;
  var buffer;

  var attribs = [];
  var datas   = [];

  var stride = 0;

  /*
  collect all attributes from base geom
  store index one in separate buffers
  */

  for ( i = 0, l = buffers.length; i < l; i++) {

    buf = buffers[i];

    // index buffer
    // ===========

    if( buf.type === 2 ) {
      var idata = compactShort(buf.data);

      buffer = new VertexBuffer();
      buffer.data = ensureUint8( idata );
      buffer.buffertype = GL_ELEMENT_ARRAY_BUFFER;

      var itype;
      switch( idata.BYTES_PER_ELEMENT ){
        case 1 : itype = GL_UNSIGNED_BYTE;  break;  
        case 2 : itype = GL_UNSIGNED_SHORT; break;  
        case 4 : itype = GL_UNSIGNED_INT;   break;  
      }
      
      attrib = new Attribute();
      attrib.name      = 'triangles';
      attrib.gltype    = itype;
      attrib.numcomps  = 3;
      attrib.bytesize  = 3 * 2;

      buffer.attributes = [attrib];

      res.buffers.push( buffer );
    } 
    
    // array buffer
    // ===========

    else {
      // assume only GL_FLOAT data here

      attrib = new Attribute();


      var name = streamName( buf.type );
      if( name == null ){
        console.log( 'warn : unknown vertex stream type', buf.type );
        continue;
      }

      attrib.name      = name;
      attrib.gltype    = GL_FLOAT;
      attrib.numcomps  = buf.components;
      attrib.bytesize  = buf.components * 4;
      attrib.normalize = false;

      attribs.push( attrib   );
      datas  .push( ensureUint8( buf.data ) );

      stride += attrib.bytesize;

    }

  }

  /*
  * do interleaving
  * per attribs -> per verts -> per bytes
  */

  var numVerts = datas[0].byteLength / attribs[0].bytesize;
  var ibuffer = new ArrayBuffer( stride * numVerts );
  var iarray  = new Uint8Array( ibuffer );

  var offset = 0;

  for ( i = 0; i < attribs.length; i++) {

    attrib = attribs[i];
    var aData  = datas[i];

    var numBytes = attrib.bytesize;

    for (var j = 0; j < numVerts; j++) {
      
      for (var k = 0; k < numBytes; k++) {
        iarray[ offset + j*stride + k ] = aData[ j*numBytes + k ];
      }

    }

    offset += attrib.bytesize;

  }


  buffer = new VertexBuffer();
  buffer.data       = iarray;
  buffer.buffertype = GL_ARRAY_BUFFER;
  buffer.attributes = attribs;
  
  res.buffers.push( buffer );

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