!function() {
    var Consts = require("../consts"), awdString = require("./awdString"), Writer = require("../bufferWriter"), Reader = require("../bufferReader"), Properties = function(expected) {
        this.expected = expected, this.vars = {};
    };
    Properties.prototype = {
        clone: function() {
            var writer = new Writer(64);
            this.write(writer);
            var copy = new Properties(this.expected);
            return copy.read(new Reader(writer.buffer)), copy;
        },
        read: function(reader) {
            var expected = this.expected, list_len = reader.U32(), list_end = reader.ptr + list_len;
            if (expected) for (;reader.ptr < list_end; ) {
                var type, key = reader.U16(), len = reader.U32();
                this.expected.hasOwnProperty(key) ? (type = expected[key], this.set(key, this.parseAttrValue(type, len, reader))) : reader.ptr += len;
            }
            reader.ptr !== list_end && (console.log("Warn Properties don't read entire data ", reader.ptr, list_end, list_len), 
            reader.ptr = list_end);
        },
        write: function(writer) {
            var sptr = writer.skipBlockSize(), vars = this.vars;
            for (var key in vars) {
                var type = this.expected[key], val = vars[key];
                writer.U16(key), this.writeAttrValue(type, val, writer);
            }
            writer.writeBlockSize(sptr);
        },
        set: function(key, value) {
            this.vars[key] = value;
        },
        get: function(key, fallback) {
            return this.vars.hasOwnProperty(key) ? this.vars[key] : fallback;
        },
        writeAttrValue: function(type, value, writer) {
            var elem_len, write_func;
            switch (type) {
              case Consts.AWD_FIELD_INT8:
                elem_len = 1, write_func = writer.I8;
                break;

              case Consts.AWD_FIELD_INT16:
                elem_len = 2, write_func = writer.I16;
                break;

              case Consts.AWD_FIELD_INT32:
                elem_len = 4, write_func = writer.I32;
                break;

              case Consts.AWD_FIELD_BOOL:
              case Consts.AWD_FIELD_UINT8:
                elem_len = 1, write_func = writer.U8;
                break;

              case Consts.AWD_FIELD_UINT16:
                elem_len = 2, write_func = writer.U16;
                break;

              case Consts.AWD_FIELD_UINT32:
              case Consts.AWD_FIELD_BADDR:
                elem_len = 4, write_func = writer.U32;
                break;

              case Consts.AWD_FIELD_FLOAT32:
                elem_len = 4, write_func = writer.F32;
                break;

              case Consts.AWD_FIELD_FLOAT64:
                elem_len = 8, write_func = writer.F64;
                break;

              case Consts.AWD_FIELD_STRING:
                return writer.U32(awdString.getUTFBytesLength(value)), void writer.writeUTFBytes(value);

              case Consts.AWD_FIELD_VECTOR2x1:
              case Consts.AWD_FIELD_VECTOR3x1:
              case Consts.AWD_FIELD_VECTOR4x1:
              case Consts.AWD_FIELD_MTX3x2:
              case Consts.AWD_FIELD_MTX3x3:
              case Consts.AWD_FIELD_MTX4x3:
              case Consts.AWD_FIELD_MTX4x4:
                elem_len = 8, write_func = writer.F64;
            }
            if (value instanceof Array) {
                writer.U32(value.length * elem_len);
                for (var i = 0, l = value.length; l > i; i++) write_func.call(writer, value[i]);
            } else writer.U32(elem_len), write_func.call(writer, value);
        },
        parseAttrValue: function(type, len, reader) {
            var elem_len, read_func;
            switch (type) {
              case Consts.AWD_FIELD_INT8:
                elem_len = 1, read_func = reader.I8;
                break;

              case Consts.AWD_FIELD_INT16:
                elem_len = 2, read_func = reader.I16;
                break;

              case Consts.AWD_FIELD_INT32:
                elem_len = 4, read_func = reader.I32;
                break;

              case Consts.AWD_FIELD_BOOL:
              case Consts.AWD_FIELD_UINT8:
                elem_len = 1, read_func = reader.U8;
                break;

              case Consts.AWD_FIELD_UINT16:
                elem_len = 2, read_func = reader.U16;
                break;

              case Consts.AWD_FIELD_UINT32:
              case Consts.AWD_FIELD_BADDR:
                elem_len = 4, read_func = reader.U32;
                break;

              case Consts.AWD_FIELD_FLOAT32:
                elem_len = 4, read_func = reader.F32;
                break;

              case Consts.AWD_FIELD_FLOAT64:
                elem_len = 8, read_func = reader.F64;
                break;

              case Consts.AWD_FIELD_STRING:
                var len2 = reader.U16();
                len2 === len && console.log("WARN may be Prefab bug / String property bug!!"), reader.ptr -= 2;
                var s = reader.readUTFBytes(len);
                return s;

              case Consts.AWD_FIELD_VECTOR2x1:
              case Consts.AWD_FIELD_VECTOR3x1:
              case Consts.AWD_FIELD_VECTOR4x1:
              case Consts.AWD_FIELD_MTX3x2:
              case Consts.AWD_FIELD_MTX3x3:
              case Consts.AWD_FIELD_MTX4x3:
              case Consts.AWD_FIELD_MTX4x4:
                elem_len = 8, read_func = reader.F64;
            }
            if (len > elem_len) {
                var list, num_read, num_elems;
                for (list = [], num_read = 0, num_elems = len / elem_len; num_elems > num_read; ) list.push(read_func.call(reader)), 
                num_read++;
                return list;
            }
            return read_func.call(reader);
        }
    }, module.exports = Properties;
}();