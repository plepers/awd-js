!function() {
    var AwdString = require("../types/awdString"), Consts = require("../consts"), BaseElement = require("../BaseElement"), Container = require("./Container"), Mesh = BaseElement.createStruct(Consts.MESH, null, {
        init: function() {
            this.model = Consts.MODEL_MESH, this.pData = {}, Container["super"](this), this.geometry = null, 
            this.materials = [];
        },
        read: function(reader) {
            var parent_id = reader.U32();
            this.matrix.read(this.awd, reader), this.name = AwdString.read(reader);
            for (var geom_id = reader.U32(), num_mats = reader.U16(), i = 0; num_mats > i; i++) {
                var mat_id = reader.U32(), matRes = this.awd.getAssetByID(mat_id, [ Consts.MODEL_MATERIAL ]);
                if (!matRes[0] && mat_id > 0) throw new Error("Could not find Material Nr " + i + " (ID = " + mat_id + " ) for this Mesh");
                mat_id > 0 && this.materials.push(matRes[1]);
            }
            this.pivot.parsePivot(this.awd, reader), this.extras.read(reader);
            var match = this.awd.getAssetByID(geom_id, [ Consts.MODEL_GEOMETRY ]);
            if (match[0] && (this.geometry = match[1]), match = this.awd.getAssetByID(parent_id, [ Consts.MODEL_CONTAINER, Consts.MODEL_MESH, Consts.MODEL_LIGHT, Consts.MODEL_ENTITY, Consts.MODEL_SEGMENT_SET ]), 
            match[0]) void 0 !== match[1].addChild && match[1].addChild(this), this.parent = match[1]; else if (parent_id > 0) throw new Error("Could not find a parent for this Mesh " + parent_id);
        },
        write: function(writer) {
            var parent_id = 0, parent = this.parent;
            parent && (parent_id = parent.chunk.id);
            var geom_id = 0, geom = this.geometry;
            geom && (geom_id = geom.chunk.id), writer.U32(parent_id), this.matrix.write(this.awd, writer), 
            AwdString.write(this.name, writer), writer.U32(geom_id);
            var ml = this.materials.length;
            writer.U16(ml);
            for (var i = 0; ml > i; i++) {
                var mat = this.materials[i];
                writer.U32(mat.chunk.id);
            }
            this.pivot.writePivot(this.awd, writer), this.extras.write(writer);
        },
        getDependencies: function() {
            for (var res = [], ml = this.materials.length, i = 0; ml > i; i++) {
                var mat = this.materials[i];
                res.push(mat);
            }
            return this.parent && res.push(this.parent), this.geometry && res.push(this.geometry), 
            res;
        },
        toString: function() {
            return "[Mesh " + this.pData.name + "]";
        }
    });
    Container.extend(Mesh.prototype), module.exports = Mesh;
}();