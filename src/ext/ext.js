var Extension           = require( '../extension' ),
    InterleavedGeometry = require( './InterleavedGeometry' ),
    ExtInfos            = require( './extInfos' );


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