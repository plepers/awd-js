var Extension     = require( './extension' );

var DefaultStruct = require( './structs/DefaultStruct' ),
    Metadata      = require( './structs/Metadata' ),
    Container     = require( './structs/Container' ),
    Mesh          = require( './structs/Mesh' ),
    Texture       = require( './structs/Texture' ),
    Namespace     = require( './structs/Namespace' ),
    Geometry      = require( './structs/Geometry' );


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
