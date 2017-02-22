var Extension = require("../extension"), Geometry = require("./Geometry"), Mesh = require("./Mesh"), Material = require("./Material"), Texture = require("./Texture"), CompositeTexture = require("./CompositeTexture"), Light = require("./Light"), Env = require("./Env"), Sky = require("./Sky"), Camera = require("./Camera"), Post = require("./Post"), ExtInfos = require("./extInfos"), structs = [ Geometry, Mesh, Material, Texture, CompositeTexture, Light, Env, Sky, Camera, Post ], Ext = ExtInfos;

Ext.getExtension = function() {
    var extension = new Extension(ExtInfos.URI);
    return extension.addStructs(structs), extension;
}, module.exports = Ext;