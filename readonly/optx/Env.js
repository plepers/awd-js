function getSHLenghtForType(type) {
    return type === SH_TYPE_TRANSPOSED ? 28 : 27;
}

function getSHTypeForLength(length) {
    if (28 === length) return SH_TYPE_TRANSPOSED;
    if (27 === length) return SH_TYPE_REGULAR;
    throw new Error("optx::Env : invalid shCoefs size : ", length);
}

var BaseElement = require("../BaseElement"), UserAttr = require("../types/userAttr"), Consts = require("../consts"), ExtInfos = require("./extInfos"), Container = require("./Container"), SH_TYPE_TRANSPOSED = 0, SH_TYPE_REGULAR = 1, Env = BaseElement.createStruct(ExtInfos.OPTX_ENV, ExtInfos.URI, {
    init: function() {
        this.model = Consts.MODEL_CONTAINER, Container["super"](this), this.name = "", this.extras = new UserAttr(), 
        this.shCoefs = null, this.brightness = 1, this.envMap = null;
    },
    read: function(reader) {
        this.readNodeCommon(reader);
        var envMap_id = reader.U32(), shType = reader.U8(), numCoeffs = getSHLenghtForType(shType);
        this.shCoefs = new Float32Array(numCoeffs);
        for (var i = 0; numCoeffs > i; i++) this.shCoefs[i] = reader.F32();
        this.brightness = reader.F32(), this.extras.read(reader);
        var match = this.awd.getAssetByID(envMap_id, [ Consts.MODEL_TEXTURE ]);
        if (!match[0] && match > 0) throw new Error("Could not find EnvMap (ID = " + envMap_id + " ) for this Env");
        envMap_id > 0 && (this.envMap = match[1]);
    },
    write: void 0,
    getDependencies: function() {
        var res = this.getGraphDependencies();
        return this.envMap && res.push(this.envMap), res;
    },
    toString: function() {
        return "[Env " + this.name + "]";
    }
});

Container.extend(Env.prototype), module.exports = Env;