!function() {
    var Consts = require("./consts"), Header = function() {
        this.size = 12, this.version = {
            major: 0,
            minor: 0
        }, this.streaming = !1, this.accuracyMatrix = !1, this.accuracyGeo = !1, this.accuracyProps = !1, 
        this.geoNrType = Consts.FLOAT32, this.matrixNrType = Consts.FLOAT32, this.propsNrType = Consts.FLOAT32, 
        this.optimized_for_accuracy = !1, this.compression = !1, this.bodylen = 0;
    };
    Header.prototype = {
        read: function(reader) {
            var magic = reader.U8() << 16 | reader.U8() << 8 | reader.U8();
            if (magic !== Consts.MAGIC) throw new Error("AWD parse error - bad magic " + magic.toString(16));
            var v = this.version;
            v.major = reader.U8(), v.minor = reader.U8();
            var flags = reader.U16();
            this.streaming = 1 === (1 & flags), this.optimized_for_accuracy = 2 === (2 & flags), 
            2 === v.major && 1 === v.minor && (this.accuracyMatrix = 2 === (2 & flags), this.accuracyGeo = 4 === (4 & flags), 
            this.accuracyProps = 8 === (8 & flags)), this.geoNrType = this.accuracyGeo ? Consts.FLOAT64 : Consts.FLOAT32, 
            this.matrixNrType = this.accuracyMatrix ? Consts.FLOAT64 : Consts.FLOAT32, this.propsNrType = this.accuracyProps ? Consts.FLOAT64 : Consts.FLOAT32, 
            this.compression = reader.U8(), this.bodylen = reader.U32();
        },
        write: function(writer) {
            writer.U8(65), writer.U8(87), writer.U8(68), writer.U8(this.version.major), writer.U8(this.version.minor);
            var flags = (this.streaming ? 1 : 0) | (this.accuracyMatrix ? 2 : 0) | (this.accuracyGeo ? 4 : 0) | (this.accuracyProps ? 8 : 0);
            writer.U16(flags), writer.U8(this.compression), writer.U32(this.bodylen);
        }
    }, module.exports = Header;
}();