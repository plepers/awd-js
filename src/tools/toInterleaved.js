var Consts       = require( '../consts' );
var BaseGeom     = require( '../std/Geometry' );
var Interleaved  = require( '../pil/InterleavedGeometry' );
var IHelpers     = require( './interleaved-helpers' );

var Attribute    = Interleaved.Attribute   ;
var VertexBuffer = Interleaved.VertexBuffer;
var Interleaving = IHelpers.Interleaving;


// var GL_ARRAY_BUFFER           = 34962,
var GL_ELEMENT_ARRAY_BUFFER   = 34963,
    GL_FLOAT                  = 5126,
    GL_UNSIGNED_SHORT         = 5123,
    GL_UNSIGNED_BYTE          = 5121,
    GL_UNSIGNED_INT           = 5125;






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
var convertSubGeom = function( geom, handleHelper ) {

  var res = new BaseGeom.SubGeom();
  res.extras  = geom.extras.clone();
  res.props   = geom.props.clone();

  //
  var buffers = geom.buffers;

  var attrib, buf, i, l;
  var buffer;

  /*
  collect all attributes from base geom
  store index one in separate buffers
  */


  var interleaving = new Interleaving();

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
      var name = streamName( buf.type );
      if( name == null ){
        console.log( 'warn : unknown vertex stream type', buf.type );
        continue;
      }

      interleaving.addAttribute(
        name,
        GL_FLOAT,
        buf.components,
        buf.components * 4,
        false,
        ensureUint8( buf.data ) 
      );


    }

  }

  if( handleHelper ){
    handleHelper( interleaving );
  }

  interleaving.process();

  res.buffers.push( interleaving.genBuffer() );

  return res;

};



function toInterleaved( g, handleHelper ) {
  var interleaved = new Interleaved();

  interleaved.name = g.name;
  interleaved.extras = g.extras.clone();
  interleaved.props = g.props.clone();

  for (var i = 0, l = g.subGeoms.length; i < l; i++) {
    var sg = g.subGeoms[i];

    interleaved.subGeoms.push( convertSubGeom( sg, handleHelper ) );
  }

  return interleaved;
}



module.exports = toInterleaved;

