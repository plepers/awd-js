var Extension     = require( '../../src/extension' );

var DefaultElement = require( '../../src/DefaultElement' ),
    Metadata      = require( './Metadata' ),
    Container     = require( './Container' ),
    Mesh          = require( './Mesh' ),
    Texture       = require( './Texture' ),
    Material      = require( './Material' ),
    //Namespace     = require( 'std/Namespace' ),
    Geometry      = require( './Geometry' );


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