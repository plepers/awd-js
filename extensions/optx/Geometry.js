var awdjs = require( 'libawd' ),

    //BaseGeom     = awdjs.Geometry,
    //BufferReader = awdjs.bufferReader,
    BaseElement  = awdjs.BaseElement,
    Consts       = awdjs.consts,
    AwdString    = awdjs.awdString,
    UserAttr     = awdjs.userAttr,
    Properties   = awdjs.properties;


var ExtInfos     = require( 'optx/extInfos' );



/**

  name      ->  AwdString
  numvbuff  ->  U16
  numibuff  ->  U16
  props     -> Properties

  vbuffers  *
    datalen     ->    U32
    numattribs  ->    U16

    attributes *
      name       ->    AwdString
      numElemes  ->    U8
      gltype     ->    U16 (glenum)
      flags      ->    U8 (normalized,...)

    DATA        ->    void *

  ibuffers  *
    datalen     ->    U32
    gltype     ->    U16 (glenum)
    usage      ->    U8
    DATA        ->    void *

  extras    -> UserAttr






**/
var Geometry = BaseElement.createStruct( ExtInfos.OPTX_GEOM, ExtInfos.URI,
{


  init : function( ){
    // todo -> OPTX_GEOM has legacy MODEL_GEOMETRY?
    this.model = Consts.MODEL_GEOMETRY;

    this.name = '';
    this.extras = new UserAttr();
    this.props = new Properties({});
    this.vertexBuffers = [];
    this.indexBuffers  = [];
  },


  read : function( reader ){

    this.name = AwdString.read( reader );
    var num_vbuff = reader.U16();
    var num_ibuff = reader.U16();

    var props = this.props;
    props.read( reader );

    var vertexBuffers = this.vertexBuffers;
    var indexBuffers  = this.indexBuffers;
    var i, buffer;


    for (i = 0; i < num_vbuff; i++) {

      buffer = new VertexBuffer();
      buffer.read( this.awd, reader );
      vertexBuffers.push( buffer );

    }

    for (i = 0; i < num_ibuff; i++) {

      buffer = new IndexBuffer();
      buffer.read( this.awd, reader );
      indexBuffers.push( buffer );

    }

    this.extras.read( reader );

  },


  write : ( CONFIG_WRITE ) ?
  function( writer ) {

    AwdString.write( this.name, writer );

    writer.U16( this.vertexBuffers.length );
    writer.U16( this.indexBuffers.length );

    var props = this.props;
    props.write( writer );

    var vertexBuffers = this.vertexBuffers;
    var indexBuffers  = this.indexBuffers;
    var i;

    for (i = 0; i < vertexBuffers.length; i++) {
      vertexBuffers[i].write( this.awd, writer );
    }


    for (i = 0; i < indexBuffers.length; i++) {
      indexBuffers[i].write( this.awd, writer );
    }

    this.extras.write( writer );


  }:undefined,


  toString : function(){
    return '[OptxGeometry ' + this.name + ']';
  }



} );


/**

    datalen     ->    U32
    numattribs  ->    U16

    attributes *
      name       ->    AwdString
      numElemes  ->    U8
      gltype     ->    U16 (glenum)
      flags      ->    U8 (normalized,...)

    DATA        ->    void *

**/

function VertexBuffer(){
  this.data = null; // Int8Array
  this.attributes = [];
}

VertexBuffer.prototype = {

  read : function( awd, reader ){
    var data_len    = reader.U32(),
        num_attribs = reader.U16();

    for( var i = 0; i < num_attribs; i++ ){
      var attrib = new VertexAttibute();
      attrib.read( reader );
      this.attributes.push( attrib );
    }

    this.data = reader.subArray( data_len );

  },

  write : function( awd, writer ){
    writer.U32( this.data.length );
    writer.U16( this.attributes.length );


    // todo validate data length vs attributes structs

    for( var i = 0; i < this.attributes.length; i++ ){
      this.attributes[i].write( writer );
    }

    writer.writeSub( this.data );

  }

};


/**
    datalen     ->    U32
    gltype     ->    U16 (glenum)
    usage      ->    U8
    DATA        ->    void *

**/


function IndexBuffer(){
  this.data = null; // Int8Array
  this.glType = 0;
  this.usage = 1; // TRIANGLES or WIREFRAME or ...
}

IndexBuffer.prototype = {


  read : function( awd, reader ){
    var data_len = reader.U32();
    this.glType  = reader.U16();
    this.usage   = reader.U8();
    this.data    = reader.subArray( data_len );
  },

  write : function( awd, writer ){
    writer.U32(   this.data.byteLength );
    writer.U16(   this.glType );
    writer.U8(    this.usage );
    writer.writeSub( this.data );
  }

};

/**
      name       ->    AwdString
      numElemes  ->    U8
      gltype     ->    U16 (glenum)
      flags      ->    U8 (normalized,...)
**/

function VertexAttibute(){
  this.name = '';
  this.numElems = 0;
  this.glType = 0;
  this.flags = 0;
}

VertexAttibute.FLAG_NORMALIZED = 1 << 1;

VertexAttibute.prototype = {

  read : function( reader ) {
    this.name     = AwdString.read( reader );
    this.numElems = reader.U8();
    this.glType   = reader.U16();
    this.flags    = reader.U8();
  },

  write : function( writer ) {
      AwdString.write( this.name, writer );
      writer.U8(  this.numElems );
      writer.U16( this.glType   );
      writer.U8(  this.flags    );
  },

  setFlag : function( flag, bool ) {
    if( bool ){
      this.flags = this.flags | flag;
    } else {
      this.flags = this.flags & (~flag);
    }
  },

  getFlag : function( flag ) {
    return (this.flags & flag) !== 0;
  },

  getBytesSize : function() {
    return getGLTypeBytesSize( this.glType ) * this.numElems;
  }

};






function getGLTypeBytesSize( type ){

  switch( type ){
    case 0x1400 :           //BYTE
    case 0x1401 : return 1; //UNSIGNED_BYTE

    case 0x1402 :           //SHORT
    case 0x1403 : return 2; //UNSIGNED_SHORT

    case 0x1404 :           //INT
    case 0x1405 :           //UNSIGNED_INT
    case 0x1406 : return 4; //FLOAT
  }

  throw new Error( "WARN getTypeSize - unexpected stream data type "+ type );
}



Geometry.types = {
  BYTE              : 0x1400,
  UNSIGNED_BYTE     : 0x1401,
  SHORT             : 0x1402,
  UNSIGNED_SHORT    : 0x1403,
  INT               : 0x1404,
  UNSIGNED_INT      : 0x1405,
  FLOAT             : 0x1406
};



Geometry.VertexBuffer   = VertexBuffer;
Geometry.IndexBuffer    = IndexBuffer;
Geometry.VertexAttibute = VertexAttibute;

Geometry.getGLTypeBytesSize  = getGLTypeBytesSize;

module.exports = Geometry;