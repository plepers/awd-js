!function() {
    var BufferReader = function(buffer, byteOffset, byteLength) {
        this.buffer = buffer, this.ptr = 0, this.littleEndien = !0, byteOffset = byteOffset || 0, 
        byteLength = byteLength || buffer.byteLength, this.view = new DataView(buffer, byteOffset, byteLength), 
        this.length = this.view.byteLength;
    };
    BufferReader.prototype = {
        setPosition: function(p) {
            this.ptr = p;
        },
        setLittleEndian: function(flag) {
            this.littleEndien = flag;
        },
        bytesAvailable: function() {
            return this.length - this.ptr;
        },
        I8: function() {
            return this.view.getInt8(this.ptr++);
        },
        U8: function() {
            return this.view.getUint8(this.ptr++);
        },
        I16: function() {
            var r = this.view.getInt16(this.ptr, this.littleEndien);
            return this.ptr += 2, r;
        },
        U16: function() {
            var r = this.view.getUint16(this.ptr, this.littleEndien);
            return this.ptr += 2, r;
        },
        I32: function() {
            var r = this.view.getInt32(this.ptr, this.littleEndien);
            return this.ptr += 4, r;
        },
        U32: function() {
            var r = this.view.getUint32(this.ptr, this.littleEndien);
            return this.ptr += 4, r;
        },
        F32: function() {
            var r = this.view.getFloat32(this.ptr, this.littleEndien);
            return this.ptr += 4, r;
        },
        F64: function() {
            var r = this.view.getFloat64(this.ptr, this.littleEndien);
            return this.ptr += 8, r;
        },
        readBytes: function(destBuffer, length) {
            void 0 === length && (length = destBuffer.byteLength);
            var output = new Int8Array(destBuffer), source = new Int8Array(this.buffer, this.ptr, length);
            output.set(source), this.ptr += length;
        },
        subArray: function(length) {
            var res = new Int8Array(this.buffer, this.ptr, length);
            return this.ptr += length, res;
        },
        readUTFBytes: function(len) {
            for (var c1, c2, c3, end = this.ptr + len, out = [], c = 0; this.ptr < end; ) c1 = this.U8(), 
            0 !== c1 && (128 > c1 ? out[c++] = String.fromCharCode(c1) : c1 > 191 && 224 > c1 ? (c2 = this.U8(), 
            out[c++] = String.fromCharCode((31 & c1) << 6 | 63 & c2)) : (c2 = this.U8(), c3 = this.U8(), 
            out[c++] = String.fromCharCode((15 & c1) << 12 | (63 & c2) << 6 | 63 & c3)));
            return out.join("");
        }
    }, module.exports = BufferReader;
}();