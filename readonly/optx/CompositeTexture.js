function decodeSwizzle(u8) {
    var maskStr, code3 = 3 & u8 >>> 6, code2 = 3 & u8 >>> 4, code1 = 3 & u8 >>> 2, code0 = 3 & u8;
    return maskStr = code2 === code3 ? code1 === code3 ? code0 === code3 ? COMPONENTS[code0] : COMPONENTS[code0] + COMPONENTS[code1] : COMPONENTS[code0] + COMPONENTS[code1] + COMPONENTS[code2] : COMPONENTS[code0] + COMPONENTS[code1] + COMPONENTS[code2] + COMPONENTS[code3];
}

function encodeSwizzle(str) {
}

var BaseElement = require("../BaseElement"), UserAttr = require("../types/userAttr"), AwdString = require("../types/awdString"), Consts = require("../consts"), ExtInfos = require("./extInfos"), COMPONENTS = [ "r", "g", "b", "a" ], MASKS = {
    r: 0,
    g: 1,
    b: 2,
    a: 3
}, CompositeTexture = BaseElement.createStruct(ExtInfos.OPTX_COMPOSITE_TEXTURE, ExtInfos.URI, {
    init: function() {
        this.model = Consts.MODEL_TEXTURE, this.name = "", this.extras = new UserAttr(), 
        this.components = null;
    },
    resolveTexture: function(id) {
        var match = this.awd.getAssetByID(id, [ Consts.MODEL_TEXTURE ]);
        if (match[0]) return match[1];
        throw new Error("Could not find referenced Texture for this CompositeTexture, uid : " + id);
    },
    read: function(reader) {
        this.name = AwdString.read(reader);
        var numComps = reader.U8();
        this.components = [];
        for (var i = 0; numComps > i; i++) this.components.push({
            out: decodeSwizzle(reader.U8()),
            comps: decodeSwizzle(reader.U8()),
            tex: this.resolveTexture(reader.U32())
        });
        this.extras.read(reader);
    },
    assertValid: function() {
        if (null == this.components) throw new Error("CompositeTexture.write -  components are not defined");
    },
    write: void 0,
    getDependencies: function() {
        return this.assertValid(), this.components.map(function(comp) {
            return comp.tex;
        });
    },
    toString: function() {
        return "[CompositeTexture " + this.name + "]";
    }
});

module.exports = CompositeTexture;