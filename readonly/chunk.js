!function() {
    var Chunk = function() {
        this.id = 0, this.ns = 0, this.type = 0, this.flags = 0, this.size = 0, this.data = null;
    };
    Chunk.prototype = {
        read: function(reader) {
            this.id = reader.U32(), this.ns = reader.U8(), this.type = reader.U8(), this.flags = reader.U8(), 
            this.size = reader.U32();
        },
        write: void 0
    }, module.exports = Chunk;
}();