function ensureUint8(array) {
    return new Uint8Array(array.buffer, array.offset, array.byteLength);
}

function compactShort(array) {
    if (2 === array.BYTES_PER_ELEMENT) {
        var i;
        for (i = 0; i < array.length; i++) if (array[i] > 255) return array;
        var res = new Uint8Array(array.length);
        for (i = 0; i < array.length; i++) res[i] = array[i];
    }
    return array;
}

function toInterleaved(g, handleHelper) {
    var interleaved = new Interleaved();
    interleaved.name = g.name, interleaved.extras = g.extras.clone(), interleaved.props = g.props.clone();
    for (var i = 0, l = g.subGeoms.length; l > i; i++) {
        var sg = g.subGeoms[i];
        interleaved.subGeoms.push(convertSubGeom(sg, handleHelper));
    }
    return interleaved;
}

var Consts = require("../consts"), BaseGeom = require("../std/Geometry"), Interleaved = require("../pil/InterleavedGeometry"), IHelpers = require("./interleaved-helpers"), Attribute = Interleaved.Attribute, VertexBuffer = Interleaved.VertexBuffer, Interleaving = IHelpers.Interleaving, GL_ELEMENT_ARRAY_BUFFER = 34963, GL_FLOAT = 5126, GL_UNSIGNED_SHORT = 5123, GL_UNSIGNED_BYTE = 5121, GL_UNSIGNED_INT = 5125, streamName = function(type) {
    switch (type) {
      case Consts.POSITION:
        return "aPosition";

      case Consts.UVS:
        return "aTexCoord";

      case Consts.NORMAL:
        return "aNormal";

      case Consts.TANGENT:
        return "aTangent";

      case Consts.JOIN_IDX:
        return "join_index";

      case Consts.JOIN_WGT:
        return "join_weight";

      case Consts.SUVS:
        return "aTexCoord1";

      case Consts.COLOR:
        return "aColor";

      case Consts.BINORMAL:
        return "aBitangent";
    }
    return null;
}, convertSubGeom = function(geom, handleHelper) {
    var res = new BaseGeom.SubGeom();
    res.extras = geom.extras.clone(), res.props = geom.props.clone();
    var attrib, buf, i, l, buffer, buffers = geom.buffers, interleaving = new Interleaving();
    for (i = 0, l = buffers.length; l > i; i++) if (buf = buffers[i], 2 === buf.type) {
        var idata = compactShort(buf.data);
        buffer = new VertexBuffer(), buffer.data = ensureUint8(idata), buffer.buffertype = GL_ELEMENT_ARRAY_BUFFER;
        var itype;
        switch (idata.BYTES_PER_ELEMENT) {
          case 1:
            itype = GL_UNSIGNED_BYTE;
            break;

          case 2:
            itype = GL_UNSIGNED_SHORT;
            break;

          case 4:
            itype = GL_UNSIGNED_INT;
        }
        attrib = new Attribute(), attrib.name = "triangles", attrib.gltype = itype, attrib.numcomps = 3, 
        attrib.bytesize = 6, buffer.attributes = [ attrib ], res.buffers.push(buffer);
    } else {
        var name = streamName(buf.type);
        if (null == name) {
            console.log("warn : unknown vertex stream type", buf.type);
            continue;
        }
        interleaving.addAttribute(name, GL_FLOAT, buf.components, 4 * buf.components, !1, ensureUint8(buf.data));
    }
    return handleHelper && handleHelper(interleaving), interleaving.process(), res.buffers.push(interleaving.genBuffer()), 
    res;
};

module.exports = toInterleaved;