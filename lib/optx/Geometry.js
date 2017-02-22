function VertexBuffer() {
    this.data = null, this.attributes = [];
}

function IndexBuffer() {
    this.data = null, this.glType = 0, this.usage = 1;
}

function VertexAttibute() {
    this.name = "", this.numElems = 0, this.glType = 0, this.flags = 0;
}

function getGLTypeBytesSize(type) {
    switch (type) {
      case 5120:
      case 5121:
        return 1;

      case 5122:
      case 5123:
        return 2;

      case 5124:
      case 5125:
      case 5126:
        return 4;
    }
    throw new Error("WARN getTypeSize - unexpected stream data type " + type);
}

var BaseElement = require("../BaseElement"), UserAttr = require("../types/userAttr"), AwdString = require("../types/awdString"), Properties = require("../types/properties"), Consts = require("../consts"), ExtInfos = require("./extInfos"), Geometry = BaseElement.createStruct(ExtInfos.OPTX_GEOM, ExtInfos.URI, {
    init: function() {
        this.model = Consts.MODEL_GEOMETRY, this.name = "", this.extras = new UserAttr(), 
        this.props = new Properties({}), this.vertexBuffers = [], this.indexBuffers = [];
    },
    read: function(reader) {
        this.name = AwdString.read(reader);
        var num_vbuff = reader.U16(), num_ibuff = reader.U16(), props = this.props;
        props.read(reader);
        var i, buffer, vertexBuffers = this.vertexBuffers, indexBuffers = this.indexBuffers;
        for (i = 0; num_vbuff > i; i++) buffer = new VertexBuffer(), buffer.read(this.awd, reader), 
        vertexBuffers.push(buffer);
        for (i = 0; num_ibuff > i; i++) buffer = new IndexBuffer(), buffer.read(this.awd, reader), 
        indexBuffers.push(buffer);
        this.extras.read(reader);
    },
    write: function(writer) {
        AwdString.write(this.name, writer), writer.U16(this.vertexBuffers.length), writer.U16(this.indexBuffers.length);
        var props = this.props;
        props.write(writer);
        var i, vertexBuffers = this.vertexBuffers, indexBuffers = this.indexBuffers;
        for (i = 0; i < vertexBuffers.length; i++) vertexBuffers[i].write(this.awd, writer);
        for (i = 0; i < indexBuffers.length; i++) indexBuffers[i].write(this.awd, writer);
        this.extras.write(writer);
    },
    toString: function() {
        return "[OptxGeometry " + this.name + "]";
    }
});

VertexBuffer.prototype = {
    read: function(awd, reader) {
        for (var data_len = reader.U32(), num_attribs = reader.U16(), i = 0; num_attribs > i; i++) {
            var attrib = new VertexAttibute();
            attrib.read(reader), this.attributes.push(attrib);
        }
        this.data = reader.subArray(data_len);
    },
    write: function(awd, writer) {
        writer.U32(this.data.length), writer.U16(this.attributes.length);
        for (var i = 0; i < this.attributes.length; i++) this.attributes[i].write(writer);
        writer.writeSub(this.data);
    }
}, IndexBuffer.prototype = {
    read: function(awd, reader) {
        var data_len = reader.U32();
        this.glType = reader.U16(), this.usage = reader.U8(), this.data = reader.subArray(data_len);
    },
    write: function(awd, writer) {
        writer.U32(this.data.byteLength), writer.U16(this.glType), writer.U8(this.usage), 
        writer.writeSub(this.data);
    }
}, IndexBuffer.TRIANGLE_USAGE = 1, IndexBuffer.WIREFRAME_USAGE = 2, VertexAttibute.FLAG_NORMALIZED = 2, 
VertexAttibute.prototype = {
    read: function(reader) {
        this.name = AwdString.read(reader), this.numElems = reader.U8(), this.glType = reader.U16(), 
        this.flags = reader.U8();
    },
    write: function(writer) {
        AwdString.write(this.name, writer), writer.U8(this.numElems), writer.U16(this.glType), 
        writer.U8(this.flags);
    },
    setFlag: function(flag, bool) {
        bool ? this.flags = this.flags | flag : this.flags = this.flags & ~flag;
    },
    getFlag: function(flag) {
        return 0 !== (this.flags & flag);
    },
    getBytesSize: function() {
        return getGLTypeBytesSize(this.glType) * this.numElems;
    }
}, Geometry.types = {
    BYTE: 5120,
    UNSIGNED_BYTE: 5121,
    SHORT: 5122,
    UNSIGNED_SHORT: 5123,
    INT: 5124,
    UNSIGNED_INT: 5125,
    FLOAT: 5126
}, Geometry.VertexBuffer = VertexBuffer, Geometry.IndexBuffer = IndexBuffer, Geometry.VertexAttibute = VertexAttibute, 
Geometry.getGLTypeBytesSize = getGLTypeBytesSize, module.exports = Geometry;