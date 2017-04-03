function Interleaving() {
    this.attributes = [], this.idata = null;
}

var InterleavedGeom = require("../pil/InterleavedGeometry"), Attribute = InterleavedGeom.Attribute, VertexBuffer = InterleavedGeom.VertexBuffer, GL_ARRAY_BUFFER = 34962;

Interleaving.prototype = {
    addAttribute: function(name, gltype, numcomps, bytesize, normalize, data) {
        var a = new Attribute();
        a.name = name, a.gltype = gltype, a.numcomps = numcomps, a.bytesize = bytesize, 
        a.normalize = normalize, this.attributes.push({
            attrib: a,
            data: data
        });
    },
    process: function() {
        var attrib, i, attribs = this.attributes, stride = 0;
        for (i = 0; i < attribs.length; i++) attrib = attribs[i].attrib, stride += attrib.bytesize;
        var numVerts = attribs[0].data.byteLength / attribs[0].attrib.bytesize, ibuffer = new ArrayBuffer(stride * numVerts), iarray = this.iarray = new Uint8Array(ibuffer), offset = 0;
        for (i = 0; i < attribs.length; i++) {
            attrib = attribs[i].attrib;
            for (var aData = attribs[i].data, numBytes = attrib.bytesize, j = 0; numVerts > j; j++) for (var k = 0; numBytes > k; k++) iarray[offset + j * stride + k] = aData[j * numBytes + k];
            offset += attrib.bytesize;
        }
    },
    genBuffer: function() {
        var buffer = new VertexBuffer();
        return buffer.data = this.iarray, buffer.buffertype = GL_ARRAY_BUFFER, buffer.attributes = this.attributes.map(function(d) {
            return d.attrib;
        }), buffer;
    }
}, module.exports = {
    Interleaving: Interleaving
};