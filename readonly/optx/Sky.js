var BaseElement = require("../BaseElement"), UserAttr = require("../types/userAttr"), Consts = require("../consts"), ExtInfos = require("./extInfos"), Container = require("./Container"), SKY_TYPE_SH = 0, SKY_TYPE_ENV = 1, Sky = BaseElement.createStruct(ExtInfos.OPTX_SKY, ExtInfos.URI, {
    init: function() {
        this.model = Consts.MODEL_CONTAINER, Container["super"](this), this.name = "", this.extras = new UserAttr(), 
        this.brightness = 1, this.env = null, this.skyType = 0;
    },
    useSHMode: function() {
        this.skyType = SKY_TYPE_SH;
    },
    useEnvmapMode: function() {
        this.skyType = SKY_TYPE_ENV;
    },
    read: function(reader) {
        this.readNodeCommon(reader);
        var env_id = reader.U32();
        this.skyType = reader.U8(), this.brightness = reader.F32(), this.extras.read(reader);
        var match = this.awd.getAssetByID(env_id, [ Consts.MODEL_CONTAINER ]);
        if (!match[0] && match > 0) throw new Error("Could not find env (ID = " + env_id + " ) for this Sky");
        env_id > 0 && (this.env = match[1]);
    },
    write: void 0,
    getDependencies: function() {
        var res = this.getGraphDependencies();
        return this.env && res.push(this.env), res;
    },
    toString: function() {
        return "[Sky " + this.name + "]";
    }
});

Sky.SKY_TYPE_SH = SKY_TYPE_SH, Sky.SKY_TYPE_ENV = SKY_TYPE_ENV, Container.extend(Sky.prototype), 
module.exports = Sky;