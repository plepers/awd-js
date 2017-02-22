var BaseElement  = require( '../BaseElement' ),
    AwdString    = require( '../types/awdString' );

var BaseGeom     = require( '../std/Geometry' );

var ExtInfos     = require( './extInfos' );


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
  this.buffertype = 0; // GL_ENUM
  this.attributes = [];
};




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






var Geometry = BaseElement.createStruct(
  ExtInfos.INTERLEAVED_GEOM,
  ExtInfos.URI,
  BaseGeom.prototype
);


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



Geometry.Attribute    = Attribute;
Geometry.VertexBuffer = VertexBuffer;



module.exports = Geometry;