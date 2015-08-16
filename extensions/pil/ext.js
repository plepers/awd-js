var awdjs = require( 'libawd' );

var Extension           = awdjs.Extension,
    InterleavedGeometry = require( 'pil/InterleavedGeometry' ),
    ExtInfos            = require( 'pil/ExtInfos' );


var structs = [
  InterleavedGeometry
];


var Ext = ExtInfos;


Ext.getExtension = function(){
  var extension = new Extension( ExtInfos.URI );
  extension.addStructs( structs );
  return extension;
};


module.exports = Ext;