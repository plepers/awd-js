var Consts = require("./consts"), BaseElement = require("./BaseElement"), DefaultElement = BaseElement.createStruct(Consts.GENERIC, -1, {
    read: function(reader) {
        this.buf = new ArrayBuffer(this.chunk.size), reader.readBytes(this.buf, this.chunk.size), 
        this.setDeps();
    },
    write: function(writer) {
        writer.writeBytes(this.buf, this.chunk.size);
    },
    setDeps: function() {
        for (var elem, elems = this.awd._elements, deps = [], i = 0, l = elems.length; l > i; i++) elem = elems[i], 
        deps.push(elem);
        this.deps = deps;
    },
    prepareAndAdd: function(awd, list) {
        if (!(list.indexOf(this) > -1)) {
            this.awd = awd;
            for (var dependencies = this.deps, i = 0, l = dependencies.length; l > i; i++) dependencies[i].prepareAndAdd(awd, list);
            this.id = list.length + 1, this.prepareChunk(), this.chunk.id = this.id, list.push(this);
        }
    },
    prepareChunk: function() {}
});

module.exports = DefaultElement;