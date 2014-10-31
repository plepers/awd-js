var Extension     = require( './extension' );

var DefaultStruct = require( './std/DefaultStruct' ),
    Metadata      = require( './std/Metadata' ),
    Container     = require( './std/Container' ),
    Mesh          = require( './std/Mesh' ),
    Texture       = require( './std/Texture' ),
    Namespace     = require( './std/Namespace' ),
    Geometry      = require( './std/Geometry' );


var structs = [
  DefaultStruct,
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
