var BaseElement = require("../BaseElement"), AwdString = require("../types/awdString"), Vec3 = require("../types/vec3"), Matrix4 = require("../types/matrix"), Consts = require("../consts"), Container = BaseElement.createStruct(-1, null, {
    init: function() {
        this.model = Consts.MODEL_CONTAINER, Container["super"](this);
    },
    readNodeCommon: function(reader) {
        var parent_id = reader.U32();
        this.matrix.read(this.awd, reader), this.pivot.parsePivot(this.awd, reader), this.name = AwdString.read(reader);
        var match = this.awd.getAssetByID(parent_id, [ Consts.MODEL_CONTAINER, Consts.MODEL_MESH, Consts.MODEL_LIGHT, Consts.MODEL_ENTITY, Consts.MODEL_SEGMENT_SET ]);
        if (match[0]) void 0 !== match[1].addChild && match[1].addChild(this), this.parent = match[1]; else if (parent_id > 0) throw new Error("Could not find a parent for this Container id : " + parent_id);
    },
    writeNodeCommon: function(writer) {
        var parent_id = 0, parent = this.parent;
        parent && (parent_id = parent.chunk.id), writer.U32(parent_id), this.matrix.write(this.awd, writer), 
        this.pivot.writePivot(this.awd, writer), AwdString.write(this.name, writer);
    },
    getGraphDependencies: function() {
        var parent = this.parent;
        return parent ? [ parent ] : [];
    },
    toString: function() {
        return "[Container " + this.name + "]";
    },
    addChild: function(child) {
        -1 === this.children.indexOf(child) && (this.children.push(child), child.parent = this);
    },
    removeChild: function(child) {
        var index = this.children.indexOf(child);
        index > -1 && (this.children.splice(index, 1), child.parent = null);
    }
});

Container.extend = function(proto) {
    proto.addChild = Container.prototype.addChild, proto.removeChild = Container.prototype.removeChild, 
    proto.writeNodeCommon = Container.prototype.writeNodeCommon, proto.readNodeCommon = Container.prototype.readNodeCommon, 
    proto.getGraphDependencies = Container.prototype.getGraphDependencies;
}, Container["super"] = function(obj) {
    obj.parent = null, obj.children = [], obj.matrix = new Matrix4(), obj.name = "", 
    obj.pivot = new Vec3();
}, module.exports = Container;