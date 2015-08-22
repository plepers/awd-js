var awdjs = require( 'awdlib' );

var Extension           = awdjs.extension,
    InterleavedGeometry = require( 'pil/InterleavedGeometry' ),
    ExtInfos            = require( 'pil/extInfos' );


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