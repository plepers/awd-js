var Extension = require("../extension"), InterleavedGeometry = require("./InterleavedGeometry"), CompactSkeletonAnimation = require("./CompactSkeletonAnimation"), ExtInfos = require("./extInfos"), structs = [ InterleavedGeometry, CompactSkeletonAnimation ], Ext = ExtInfos;

Ext.getExtension = function() {
    var extension = new Extension(ExtInfos.URI);
    return extension.addStructs(structs), extension;
}, module.exports = Ext;