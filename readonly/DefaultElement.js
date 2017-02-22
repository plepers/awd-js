var Consts = require("./consts"), BaseElement = require("./BaseElement"), DefaultElement = BaseElement.createStruct(Consts.GENERIC, -1, {
    read: function(reader) {
        this.buf = new ArrayBuffer(this.chunk.size), reader.readBytes(this.buf, this.chunk.size), 
        this.setDeps();
    },
    write: void 0,
    setDeps: function() {
        for (var elem, elems = this.awd._elements, deps = [], i = 0, l = elems.length; l > i; i++) elem = elems[i], 
        deps.push(elem);
        this.deps = deps;
    },
    prepareAndAdd: void 0,
    prepareChunk: function() {}
});

module.exports = DefaultElement;