var Extension     = require( 'extension' );

var DefaultElement = require( 'DefaultElement' ),
    Metadata      = require( 'std/Metadata' ),
    Container     = require( 'std/Container' ),
    Mesh          = require( 'std/Mesh' ),
    Texture       = require( 'std/Texture' ),
    Namespace     = require( 'std/Namespace' ),
    Geometry      = require( 'std/Geometry' );


var structs = [
  DefaultElement,
  Metadata,
  Container,
  Mesh,
  Texture,
  Namespace,
  Geometry
];


module.exports = function(){
  var extension = new Extension( null );
  extension.addStructs( structs );
  return extension;
};
