!function() {
    var BufferWriter = require("./bufferWriter"), ALLOC = 262144, Writer = {
        write: function(awd) {
            var writer = new BufferWriter(ALLOC);
            writer.ptr = awd.header.size;
            for (var elem, elems = awd._elements, sorted = [], i = 0, l = elems.length; l > i; i++) elem = elems[i], 
            elem.prepareAndAdd(awd, sorted);
            var sptr;
            for (i = 0, l = sorted.length; l > i; i++) -1 !== elems.indexOf(sorted[i]) && (sorted[i].chunk.write(writer), 
            sptr = writer.skipBlockSize(), sorted[i].write(writer), writer.writeBlockSize(sptr));
            var end = writer.ptr;
            return writer.ptr = 0, awd.header.bodylen = end - awd.header.size, awd.header.write(writer), 
            writer.ptr = end, writer.copy();
        }
    };
    module.exports = Writer;
}();