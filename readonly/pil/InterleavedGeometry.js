function Attribute() {
    this.name = "", this.bytesize = 0, this.gltype = 0, this.numcomps = 0, this.normalize = !1;
}

var BaseElement = require("../BaseElement"), AwdString = require("../types/awdString"), BaseGeom = require("../std/Geometry"), ExtInfos = require("./extInfos");

Attribute.prototype = {
    read: function(reader) {
        this.name = AwdString.read(reader), this.bytesize = reader.U8(), this.gltype = reader.U16();
        var buf = reader.U8();
        this.numcomps = 7 & buf, this.normalize = !!(buf >>> 3 & 1);
    },
    write: void 0
};

var VertexBuffer = function() {
    this.data = null, this.buffertype = 0, this.attributes = [];
};

VertexBuffer.prototype = {
    read: function(reader) {
        var num_attr = reader.U8(), btype = reader.U16(), attribs = this.attributes;
        this.buffertype = btype;
        for (var i = 0; num_attr > i; i++) {
            var attrib = new Attribute();
            attrib.read(reader), attribs.push(attrib);
        }
        var padding = reader.U8();
        reader.ptr += padding;
        var str_len = reader.U32(), str_end = reader.ptr + str_len;
        this.data = new Uint8Array(reader.buffer, reader.ptr, str_len), reader.ptr = str_end;
    },
    write: void 0
};

var Geometry = BaseElement.createStruct(ExtInfos.INTERLEAVED_GEOM, ExtInfos.URI, BaseGeom.prototype);

Geometry.prototype.subGeomFactory = function() {
    var sg = BaseGeom.prototype.subGeomFactory();
    return sg.bufferFactory = this.bufferFactory, sg;
}, Geometry.prototype.bufferFactory = function() {
    return new VertexBuffer();
}, Geometry.prototype.toString = function() {
    return "[InterleavedGeometry " + this.name + "]";
}, Geometry.Attribute = Attribute, Geometry.VertexBuffer = VertexBuffer, module.exports = Geometry;