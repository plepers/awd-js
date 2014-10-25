var Ext   = require( './ext' ),
    IGeom = require( './InterleavedGeometry' );

module.exports = function( block ) {

  if( block.ns !== Ext.NS ) {
    console.log( "awdjs ext struct factory receive wrong namespace "+ block.ns );
  }

  var type = block.type;

  switch( type ) {
    case IGeom.TYPE :
      return new IGeom();
    default :
      return null;
  }

};