var awdjs = require( 'libawd' );

var Extension     = awdjs.extension,
    Geometry      = require( 'optx/Geometry' ),
    Mesh          = require( 'optx/Mesh' ),
    Material          = require( 'optx/Material' ),
    ExtInfos      = require( 'optx/extInfos' );


var structs = [
  Geometry,
  Mesh,
  Material
];


var Ext = ExtInfos;


Ext.getExtension = function(){
  var extension = new Extension( ExtInfos.URI );
  extension.addStructs( structs );
  return extension;
};


module.exports = Ext;