!function() {
    var Consts = require("./consts"), Chunk = require("./chunk"), DefaultElement = {
        _setup: function(awd, chunk) {
            this.awd = awd, this.chunk = chunk, this.id = chunk.id;
        },
        init: function() {
            this.injectDeps = !1, this.model = Consts.MODEL_GENERIC;
        },
        getDependencies: function() {
            return this.deps ? this.deps : null;
        },
        prepareAndAdd: void 0,
        prepareChunk: function() {
            null === this.chunk && (this.chunk = new Chunk()), this.chunk.type = this.type, 
            this.chunk.ns = this.ns;
        }
    }, BaseElement = {};
    BaseElement.createStruct = function(type, nsUri, proto) {
        var Struct = function() {
            this.type = type, this.nsUri = nsUri, this.ns = 0, this.injectDeps = !0, this.init(), 
            this.chunk = null, this.id = -1;
        };
        Struct.TYPE = type;
        var key;
        for (key in DefaultElement) Struct.prototype[key] = DefaultElement[key];
        for (key in proto) Struct.prototype[key] = proto[key];
        return Struct;
    }, module.exports = BaseElement;
}();