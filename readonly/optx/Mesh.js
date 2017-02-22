function SubMesh() {
    this.material = null, this.firstIndex = 0, this.indexCount = 0, this.firstWireIndex = 0, 
    this.wireIndexCount = 0;
}

var BaseElement = require("../BaseElement"), UserAttr = require("../types/userAttr"), Properties = require("../types/properties"), Consts = require("../consts"), ExtInfos = require("./extInfos"), Container = require("./Container"), PROPS = {
    cullBackFaces: 1,
    castShadows: 2,
    bounds: 10
}, Mesh = BaseElement.createStruct(ExtInfos.OPTX_MESH, ExtInfos.URI, {
    init: function() {
        this.model = Consts.MODEL_MESH, Container["super"](this), this.geometry = null, 
        this.extras = new UserAttr(), this.props = new Properties({
            1: Consts.AWD_FIELD_BOOL,
            2: Consts.AWD_FIELD_BOOL,
            10: Consts.AWD_FIELD_FLOAT32
        }), this.submeshes = [];
    },
    read: function(reader) {
        this.readNodeCommon(reader);
        var geom_id = reader.U32();
        this.props.read(reader);
        for (var num_subs = reader.U16(), i = 0; num_subs > i; i++) {
            var submesh = new SubMesh();
            submesh.read(this.awd, reader), this.submeshes.push(submesh);
        }
        this.extras.read(reader);
        var match = this.awd.getAssetByID(geom_id, [ Consts.MODEL_GEOMETRY ]);
        match[0] && (this.geometry = match[1]);
    },
    write: void 0,
    getCullBackFace: function() {
        return 1 === this.props.get(PROPS.cullBackFaces, !0);
    },
    setCullBackFace: function(bool) {
        this.props.set(PROPS.cullBackFaces, bool);
    },
    getCastShadows: function() {
        return 1 === this.props.get(PROPS.castShadows, !1);
    },
    setCastShadows: function(bool) {
        this.props.set(PROPS.castShadows, bool);
    },
    getDependencies: function() {
        for (var res = this.getGraphDependencies(), sublen = this.submeshes.length, i = 0; sublen > i; i++) {
            var mat = this.submeshes[i].material;
            mat && res.push(mat);
        }
        return this.geometry && res.push(this.geometry), res;
    },
    toString: function() {
        return "[Mesh " + this.pData.name + "]";
    }
});

SubMesh.prototype = {
    read: function(awd, reader) {
        var matId = reader.U32();
        this.firstIndex = reader.U32(), this.indexCount = reader.U32(), this.firstWireIndex = reader.U32(), 
        this.wireIndexCount = reader.U32();
        var matRes = awd.getAssetByID(matId, [ Consts.MODEL_MATERIAL ]);
        if (!matRes[0] && matId > 0) throw new Error("Could not find Material (ID = " + matId + " ) for this SubMesh");
        matId > 0 && (this.material = matRes[1]);
    },
    write: function(awd, writer) {
        var matId = 0, mat = this.material;
        mat && (matId = mat.chunk.id), writer.U32(matId), writer.U32(this.firstIndex), writer.U32(this.indexCount), 
        writer.U32(this.firstWireIndex), writer.U32(this.wireIndexCount);
    }
}, Container.extend(Mesh.prototype), Mesh.SubMesh = SubMesh, module.exports = Mesh;