var BaseElement = require("../BaseElement"), UserAttr = require("../types/userAttr"), Consts = require("../consts"), ExtInfos = require("./extInfos"), Container = require("./Container"), LENS_PERSPECTIVE = 0, LENS_ORTHOGRAPHIC = 1, Camera = BaseElement.createStruct(ExtInfos.OPTX_CAMERA, ExtInfos.URI, {
    init: function() {
        this.model = Consts.MODEL_CAMERA, Container["super"](this), this.name = "", this.extras = new UserAttr(), 
        this.lensType = LENS_PERSPECTIVE, this.near = .1, this.far = 1e3, this.fov = 60, 
        this.minX = -20, this.maxX = 20, this.minY = -20, this.maxY = 20, this.post = null;
    },
    makePerspective: function(fov, near, far) {
        this.lensType = LENS_PERSPECTIVE, this.fov = fov, this.near = near, this.far = far;
    },
    makeOrtho: function(minX, maxX, minY, maxY, near, far) {
        this.lensType = LENS_ORTHOGRAPHIC, this.minX = minX, this.maxX = maxX, this.minY = minY, 
        this.maxY = maxY, this.near = near, this.far = far;
    },
    read: function(reader) {
        this.readNodeCommon(reader);
        var postId = reader.U32();
        if (this.lensType = reader.U8(), this.near = reader.F32(), this.far = reader.F32(), 
        this.lensType === LENS_PERSPECTIVE ? this.fov = reader.F32() : this.lensType === LENS_ORTHOGRAPHIC && (this.minX = reader.F32(), 
        this.maxX = reader.F32(), this.minY = reader.F32(), this.maxY = reader.F32()), this.extras.read(reader), 
        postId > 0) {
            var match = this.awd.getAssetByID(postId, [ Consts.MODEL_GENERIC ]);
            if (match[0]) return match[1];
            throw new Error("Could not find Post for this Camera, uid : " + postId);
        }
        return null;
    },
    write: function(writer) {
        this.writeNodeCommon(writer);
        var postId = 0;
        this.post && (postId = this.post.chunk.id), writer.U32(postId), writer.U8(this.lensType), 
        writer.F32(this.near), writer.F32(this.far), this.lensType === LENS_PERSPECTIVE ? writer.F32(this.fov) : this.lensType === LENS_ORTHOGRAPHIC && (writer.F32(this.minX), 
        writer.F32(this.maxX), writer.F32(this.minY), writer.F32(this.maxY)), this.extras.write(writer);
    },
    getDependencies: function() {
        var dep = this.getGraphDependencies();
        return this.post && dep.push(this.post), dep;
    },
    toString: function() {
        return "[Camera " + this.name + "]";
    }
});

Camera.LENS_PERSPECTIVE = LENS_PERSPECTIVE, Camera.LENS_ORTHOGRAPHIC = LENS_ORTHOGRAPHIC, 
Container.extend(Camera.prototype), module.exports = Camera;