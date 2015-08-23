var awdjs = require( 'awdlib' );

var Extension          = awdjs.extension,
    Geometry           = require( 'optx/Geometry' ),
    Mesh               = require( 'optx/Mesh' ),
    Material           = require( 'optx/Material' ),
    Texture            = require( 'optx/Texture' ),
    CompositeTexture   = require( 'optx/CompositeTexture' ),
    Light              = require( 'optx/Light' ),
    Env                = require( 'optx/Env' ),
    Sky                = require( 'optx/Sky' ),
    Camera             = require( 'optx/Camera' ),
    Post               = require( 'optx/Post' ),
    ExtInfos           = require( 'optx/extInfos' );


var structs = [
  Geometry,
  Mesh,
  Material,
  Texture,
  CompositeTexture,
  Light,
  Env,
  Sky,
  Camera,
  Post
];


var Ext = ExtInfos;


Ext.getExtension = function(){
  var extension = new Extension( ExtInfos.URI );
  extension.addStructs( structs );
  return extension;
};


module.exports = Ext;