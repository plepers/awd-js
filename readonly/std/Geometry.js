!function() {
    "use strict";
    var Consts = require("../consts"), AwdString = require("../types/awdString"), UserAttr = require("../types/userAttr"), Properties = require("../types/properties"), BaseElement = require("../BaseElement"), Geometry = BaseElement.createStruct(Consts.GEOMETRY, null, {
        subGeomFactory: function() {
            var sg = new SubGeom();
            return sg.bufferFactory = this.bufferFactory, sg;
        },
        bufferFactory: function() {
            return new VertexBuffer();
        },
        init: function() {
            this.model = Consts.MODEL_GEOMETRY, this.name = "", this.extras = new UserAttr(), 
            this.props = new Properties({}), this.subGeoms = [];
        },
        read: function(reader) {
            this.name = AwdString.read(reader);
            var num_subs = reader.U16(), geomType = this.awd.header.geoNrType, props = this.props;
            props.expected[1] = geomType, props.expected[2] = geomType, props.read(reader);
            var geoScaleU = props.get(1, 1), geoScaleV = props.get(2, 1);
            1 === geoScaleU && 1 === geoScaleV || console.log("WARN defined scale UV in geometry");
            for (var subGeom, subGeoms = this.subGeoms, i = 0; num_subs > i; i++) subGeom = this.subGeomFactory(), 
            subGeom.read(this.awd, reader), subGeoms.push(subGeom);
            this.extras.read(reader);
        },
        write: void 0,
        toString: function() {
            return "[Geometry " + this.name + "]";
        }
    }), SubGeom = function() {
        this.buffers = [], this.extras = new UserAttr(), this.props = new Properties({});
    };
    SubGeom.prototype = {
        getBuffersByType: function(type, res) {
            void 0 === res && (res = []);
            var i, l;
            if (type instanceof Array) for (i = 0, l = type.length; l > i; i++) this.getBuffersByType(type[i], res); else for (i = 0, 
            l = this.buffers.length; l > i; i++) this.buffers[i].type === type && res.push(this.buffers[i]);
            return res;
        },
        read: function(awd, reader) {
            var glen = reader.U32(), gend = reader.ptr + glen, geomType = awd.header.geoNrType, props = this.props;
            props.expected[1] = geomType, props.expected[2] = geomType, props.read(reader);
            var geoScaleU = props.get(1, 1), geoScaleV = props.get(2, 1);
            1 === geoScaleU && 1 === geoScaleV || console.log("WARN defined scale UV in sub-geometry");
            for (var buffer, nverts = -1; reader.ptr < gend; ) buffer = this.bufferFactory(), 
            buffer.read(reader), !buffer.isIndex && buffer.numVertices > -1 && (nverts > -1 && buffer.numVertices !== nverts && console.log("Warn buffers in geom has differents num vertices", nverts, buffer.numVertices), 
            nverts = buffer.numVertices), this.buffers.push(buffer);
            for (var i = 0, l = this.buffers.length; l > i; i++) buffer = this.buffers[i], -1 !== buffer.numVertices || buffer.isIndex || buffer.solveSize(nverts);
            this.extras.read(reader);
        },
        write: function(awd, writer) {
            var sptr = writer.skipBlockSize();
            this.writeProps(awd, writer);
            for (var i = 0, l = this.buffers.length; l > i; i++) {
                var buffer = this.buffers[i];
                buffer.write(writer);
            }
            writer.writeBlockSize(sptr), this.extras.write(writer);
        },
        writeProps: function(awd, writer) {
            var geomType = awd.header.geoNrType, props = this.props;
            props.expected[1] = geomType, props.expected[2] = geomType, props.set(1, 1), props.set(2, 1), 
            props.write(writer);
        }
    };
    var fixC4D_Type = function(val) {
        return 2 === val ? Consts.AWD_FIELD_UINT16 : val;
    }, VertexBuffer = function() {
        this.data = null, this.numVertices = -1, this.type = 0, this.components = 0, this.ftype = Consts.T_FLOAT, 
        this.isIndex = !1;
    };
    VertexBuffer.HEAD_SIZE = 6, VertexBuffer.prototype = {
        allocate: function(size, ftype) {
            var Class = getArray(ftype);
            void 0 === Class && console.log(ftype), this.data = new Class(size);
        },
        solveSize: function(numVerts) {
            this.numVertices = numVerts, this.components = this.data.length / numVerts;
        },
        read: function(reader) {
            var str_type = reader.U8(), str_ftype = reader.U8(), str_len = reader.U32(), str_end = reader.ptr + str_len;
            str_ftype = fixC4D_Type(str_ftype), str_ftype !== Consts.AWD_FIELD_UINT8 && str_ftype !== Consts.AWD_FIELD_UINT16 && str_ftype !== Consts.AWD_FIELD_FLOAT32 && str_ftype !== Consts.AWD_FIELD_FLOAT64 && console.log("WARN unexpected stream data type ", str_ftype, str_type, str_len);
            var size = getBufferSize(str_type);
            this.isIndex = str_type === Consts.INDEX, this.type = str_type, this.components = size, 
            this.ftype = str_ftype;
            var typeSize = getTypeSize(str_ftype), numVals = str_len / typeSize;
            -1 !== size && (this.numVertices = numVals / size), this.allocate(numVals, str_ftype);
            for (var read = getReadFunc(str_ftype, reader), data = this.data, c = 0; reader.ptr < str_end; ) data[c++] = read.call(reader);
        },
        write: function(writer) {
            writer.U8(this.type), writer.U8(this.ftype);
            for (var sptr = writer.skipBlockSize(), writeFn = getWriteFunc(this.ftype, writer), data = this.data, i = 0, l = data.length; l > i; i++) writeFn.call(writer, data[i]);
            writer.writeBlockSize(sptr);
        }
    };
    var getTypeSize = function(type) {
        switch (type) {
          case Consts.AWD_FIELD_UINT8:
            return 1;

          case Consts.AWD_FIELD_UINT16:
            return 2;

          case Consts.AWD_FIELD_FLOAT32:
            return 4;

          case Consts.AWD_FIELD_FLOAT64:
            return 8;
        }
        throw new Error("WARN getTypeSize - unexpected stream data type " + type);
    }, getReadFunc = function(type, reader) {
        switch (type) {
          case Consts.AWD_FIELD_UINT8:
            return reader.U8;

          case Consts.AWD_FIELD_UINT16:
            return reader.U16;

          case Consts.AWD_FIELD_FLOAT32:
            return reader.F32;

          case Consts.AWD_FIELD_FLOAT64:
            return reader.F64;
        }
        throw new Error("WARN getReadFunc - unexpected stream data type " + type);
    }, getWriteFunc = function(type, writer) {
        switch (type) {
          case Consts.AWD_FIELD_UINT8:
            return writer.U8;

          case Consts.AWD_FIELD_UINT16:
            return writer.U16;

          case Consts.AWD_FIELD_FLOAT32:
            return writer.F32;

          case Consts.AWD_FIELD_FLOAT64:
            return writer.F64;
        }
        throw new Error("WARN getWriteFunc - unexpected stream data type " + type);
    }, getArray = function(type) {
        switch (type) {
          case Consts.AWD_FIELD_UINT8:
            return Uint8Array;

          case Consts.AWD_FIELD_UINT16:
            return Uint16Array;

          case Consts.AWD_FIELD_FLOAT32:
            return Float32Array;

          case Consts.AWD_FIELD_FLOAT64:
            return Float64Array;
        }
        throw new Error("WARN getArray - unexpected stream data type " + type);
    }, getBufferSize = function(type) {
        switch (type) {
          case Consts.POSITION:
          case Consts.INDEX:
          case Consts.NORMAL:
          case Consts.TANGENT:
          case Consts.BINORMAL:
            return 3;

          case Consts.UVS:
            return 2;

          case Consts.JOIN_WGT:
          case Consts.JOIN_IDX:
            return -1;

          default:
            return -1;
        }
    };
    Geometry.SubGeom = SubGeom, Geometry.VertexBuffer = VertexBuffer, Geometry.getTypeSize = getTypeSize, 
    Geometry.getReadFunc = getReadFunc, Geometry.getWriteFunc = getWriteFunc, Geometry.getArray = getArray, 
    Geometry.fixC4D_Type = fixC4D_Type, module.exports = Geometry;
}();