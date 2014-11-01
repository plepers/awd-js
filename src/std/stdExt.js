var Extension     = require( '../extension' );

var DefaultElement = require( '../DefaultElement' ),
    Metadata      = require( './Metadata' ),
    Container     = require( './Container' ),
    Mesh          = require( './Mesh' ),
    Texture       = require( './Texture' ),
    Namespace     = require( './Namespace' ),
    Geometry      = require( './Geometry' );


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
