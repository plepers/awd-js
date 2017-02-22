

var InterleavedGeom  = require( '../pil/InterleavedGeometry' );

var Attribute    = InterleavedGeom.Attribute   ;
var VertexBuffer = InterleavedGeom.VertexBuffer;



var GL_ARRAY_BUFFER           = 34962;

function Interleaving(){

  console.log( 'new ih' );
  this.attributes = [];
  this.idata   = null;
}






Interleaving.prototype = {

  addAttribute : function(      
      name     ,
      gltype   ,
      numcomps ,
      bytesize ,
      normalize,
      data ){

    var a = new Attribute();

    a.name      = name     ;
    a.gltype    = gltype   ;
    a.numcomps  = numcomps ;
    a.bytesize  = bytesize ;
    a.normalize = normalize;


    this.attributes.push( {
      attrib : a,
      data : data
    } );


  },


  process : function(){
    
    var attribs = this.attributes;
    var attrib, i;

    var stride = 0;
    
    for ( i = 0; i < attribs.length; i++) {

      attrib = attribs[i].attrib;
      stride += attrib.bytesize;

    }

    var numVerts = attribs[0].data.byteLength / attribs[0].attrib.bytesize;
    var ibuffer = new ArrayBuffer( stride * numVerts );

    console.log( stride );
    
    var iarray = this.iarray = new Uint8Array( ibuffer );

    var offset = 0;

    for ( i = 0; i < attribs.length; i++) {

      attrib = attribs[i].attrib;
      var aData  = attribs[i].data;

      var numBytes = attrib.bytesize;

      for (var j = 0; j < numVerts; j++) {
        
        for (var k = 0; k < numBytes; k++) {
          iarray[ offset + j*stride + k ] = aData[ j*numBytes + k ];
        }

      }

      offset += attrib.bytesize;

    }

  },


  genBuffer : function(){

    var buffer = new VertexBuffer();
    buffer.data       = this.iarray;
    buffer.buffertype = GL_ARRAY_BUFFER;
    buffer.attributes = this.attributes.map(function(d){
      return d.attrib;
    });

    return buffer;
  }


};


module.exports = {
  Interleaving : Interleaving
};