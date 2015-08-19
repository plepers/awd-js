var awdjs = require( 'libawd' );

var Extension          = awdjs.extension,
    Geometry           = require( 'optx/Geometry' ),
    Mesh               = require( 'optx/Mesh' ),
    Material           = require( 'optx/Material' ),
    Texture            = require( 'optx/Texture' ),
    CompositeTexture   = require( 'optx/CompositeTexture' ),
    ExtInfos           = require( 'optx/extInfos' );


var structs = [
  Geometry,
  Mesh,
  Material,
  Texture,
  CompositeTexture
];


var Ext = ExtInfos;


Ext.getExtension = function(){
  var extension = new Extension( ExtInfos.URI );
  extension.addStructs( structs );
  return extension;
};


module.exports = Ext;