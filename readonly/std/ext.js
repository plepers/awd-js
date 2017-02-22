var Extension = require("../extension"), DefaultElement = require("../DefaultElement"), Metadata = require("./Metadata"), Container = require("./Container"), Mesh = require("./Mesh"), Texture = require("./Texture"), Material = require("./Material"), Skeleton = require("./Skeleton"), SkeletonPose = require("./SkeletonPose"), SkeletonAnimation = require("./SkeletonAnimation"), AnimationSet = require("./AnimationSet"), Animator = require("./Animator"), Geometry = require("./Geometry"), structs = [ DefaultElement, Metadata, Container, Mesh, Texture, Material, Skeleton, SkeletonPose, SkeletonAnimation, AnimationSet, Animator, Geometry ], Ext = {};

Ext.getExtension = function() {
    var extension = new Extension(null);
    return extension.addStructs(structs), extension;
}, module.exports = Ext;