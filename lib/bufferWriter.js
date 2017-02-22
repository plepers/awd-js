require("string.prototype.codepointat");

var REALLOC = 65536, _utfHead = function() {
    for (var a = [], i = 0; 5 > i; i++) a[i] = parseInt("1111".slice(0, i), 2);
    return a;
}(), BufferWriter = function(size) {
    this.buffer = new ArrayBuffer(size), this.ptr = 0, this.littleEndien = !0, this.view = new DataView(this.buffer), 
    this.length = this.view.byteLength, this.skips = [];
};

BufferWriter.prototype = {
    _ensureSize: function(size) {
        this.ptr + size > this.buffer.byteLength && this._realloc(this.ptr + size);
    },
    _realloc: function(min) {
        for (var clen = this.buffer.byteLength, reallocSize = REALLOC; min > clen + reallocSize; ) reallocSize += REALLOC;
        var newSize = clen + reallocSize, buf = new ArrayBuffer(newSize);
        new Int8Array(buf).set(new Int8Array(this.buffer)), this.buffer = buf, this.view = new DataView(buf), 
        this.length = buf.length;
    },
    skipBlockSize: function() {
        return this.ptr += 4, this.ptr;
    },
    writeBlockSize: function(ptr) {
        var size = this.ptr - ptr, restorePtr = this.ptr;
        this.ptr = ptr - 4, this.U32(size), this.ptr = restorePtr;
    },
    copy: function() {
        var res = new ArrayBuffer(this.ptr);
        return new Int8Array(res).set(new Int8Array(this.buffer, 0, this.ptr)), res;
    },
    setPosition: function(p) {
        this.ptr = p;
    },
    setLittleEndian: function(flag) {
        this.littleEndien = flag;
    },
    bytesAvailable: function() {
        return this.length - this.ptr;
    },
    I8: function(val) {
        return this._ensureSize(1), this.view.setInt8(this.ptr++, val);
    },
    U8: function(val) {
        return this._ensureSize(1), this.view.setUint8(this.ptr++, val);
    },
    I16: function(val) {
        this._ensureSize(2), this.view.setInt16(this.ptr, val, this.littleEndien), this.ptr += 2;
    },
    U16: function(val) {
        this._ensureSize(2), this.view.setUint16(this.ptr, val, this.littleEndien), this.ptr += 2;
    },
    I32: function(val) {
        this._ensureSize(4), this.view.setInt32(this.ptr, val, this.littleEndien), this.ptr += 4;
    },
    U32: function(val) {
        this._ensureSize(4), this.view.setUint32(this.ptr, val, this.littleEndien), this.ptr += 4;
    },
    F32: function(val) {
        this._ensureSize(4), this.view.setFloat32(this.ptr, val, this.littleEndien), this.ptr += 4;
    },
    F64: function(val) {
        this._ensureSize(8), this.view.setFloat64(this.ptr, val, this.littleEndien), this.ptr += 8;
    },
    writeBytes: function(srcBuffer, length) {
        void 0 === length && (length = srcBuffer.byteLength), this._ensureSize(length);
        var output = new Int8Array(this.buffer, this.ptr, length), source = new Int8Array(srcBuffer, 0, length);
        output.set(source), this.ptr += length;
    },
    writeSub: function(intArray) {
        var length = intArray.byteLength;
        this._ensureSize(length);
        var output = new Int8Array(this.buffer, this.ptr, length);
        output.set(intArray), this.ptr += length;
    },
    writeUTF: function(string) {
        return this._ensureSize(4 * string.length + 2), this.U16(string.length), this.writeUTFBytes(string);
    },
    writeUTFBytes: function(string) {
        for (var i = 0, j = string.length; j > i; i++) {
            var neededBytes, charCode = string[i].codePointAt(0);
            if (128 > charCode ? neededBytes = 1 : 2048 > charCode ? neededBytes = 2 : 65536 > charCode ? neededBytes = 3 : 2097152 > charCode && (neededBytes = 4), 
            1 === neededBytes) this.U8(charCode); else for (this.U8((_utfHead[neededBytes] << 8 - neededBytes) + (charCode >>> 6 * --neededBytes)); neededBytes > 0; ) this.U8(charCode >>> 6 * --neededBytes & 63 | 128);
        }
    }
}, module.exports = BufferWriter;