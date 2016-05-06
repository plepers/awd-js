var Extension     = require( 'extension' );

var DefaultElement = require( 'DefaultElement' ),
    Metadata      = require( 'std/Metadata' ),
    Container     = require( 'std/Container' ),
    Mesh          = require( 'std/Mesh' ),
    Texture       = require( 'std/Texture' ),
    Material      = require( 'std/Material' ),
    //Namespace     = require( 'std/Namespace' ),
    Geometry      = require( 'std/Geometry' );


var structs = [
  DefaultElement,
  Metadata,
  Container,
  Mesh,
  Texture,
  Material,
  //Namespace,
  Geometry
];

var Ext = {};


Ext.getExtension = function(){
  var extension = new Extension( null );
  extension.addStructs( structs );
  return extension;
};


module.exports = Ext;