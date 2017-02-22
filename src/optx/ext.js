

var Extension          = require( '../extension' );

var Geometry           = require( './Geometry' ),
    Mesh               = require( './Mesh' ),
    Material           = require( './Material' ),
    Texture            = require( './Texture' ),
    CompositeTexture   = require( './CompositeTexture' ),
    Light              = require( './Light' ),
    Env                = require( './Env' ),
    Sky                = require( './Sky' ),
    Camera             = require( './Camera' ),
    Post               = require( './Post' ),
    ExtInfos           = require( './extInfos' );


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