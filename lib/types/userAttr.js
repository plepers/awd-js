!function() {
    var Consts = require("../consts"), AwdString = require("./awdString"), Writer = require("../bufferWriter"), Reader = require("../bufferReader"), UserAttributes = function() {
        this.attributes = {}, this._list = [];
    };
    UserAttributes.prototype = {
        clone: function() {
            var writer = new Writer(64);
            this.write(writer);
            var copy = new UserAttributes();
            return copy.read(new Reader(writer.buffer)), copy;
        },
        addAttribute: function(name, value, type, ns) {
            var attrib = {
                name: name,
                value: value,
                type: type,
                ns: ns
            };
            this.attributes[name] = attrib, this._list.push(attrib);
        },
        read: function(reader) {
            var attributes, list_len = reader.U32();
            if (list_len > 0) {
                attributes = {};
                for (var list_end = reader.ptr + list_len; reader.ptr < list_end; ) {
                    var attr_val, ns_id = reader.U8(), attr_key = AwdString.read(reader), attr_type = reader.U8(), attr_len = reader.U32();
                    switch (attr_type) {
                      case Consts.AWDSTRING:
                        attr_val = reader.readUTFBytes(attr_len);
                        break;

                      case Consts.INT8:
                        attr_val = reader.I8();
                        break;

                      case Consts.INT16:
                        attr_val = reader.I16();
                        break;

                      case Consts.INT32:
                        attr_val = reader.I32();
                        break;

                      case Consts.BOOL:
                      case Consts.UINT8:
                        attr_val = reader.U8();
                        break;

                      case Consts.UINT16:
                        attr_val = reader.U16();
                        break;

                      case Consts.UINT32:
                      case Consts.BADDR:
                        attr_val = reader.U32();
                        break;

                      case Consts.FLOAT32:
                        attr_val = reader.F32();
                        break;

                      case Consts.FLOAT64:
                        attr_val = reader.F64();
                        break;

                      default:
                        attr_val = "unimplemented attribute type " + attr_type + "ns : " + ns_id, reader.ptr += attr_len;
                    }
                    this.addAttribute(attr_key, attr_val, attr_type, ns_id), attributes[attr_key] = attr_val;
                }
            }
            return attributes;
        },
        write: function(writer) {
            for (var sptr = writer.skipBlockSize(), i = 0, l = this._list.length; l > i; i++) {
                var attr_len, attr = this._list[i], ns_id = attr.ns, attr_key = attr.name, attr_type = attr.type, attr_val = attr.value;
                switch (writer.U8(ns_id), AwdString.write(attr_key, writer), writer.U8(attr_type), 
                attr_type) {
                  case Consts.AWDSTRING:
                    attr_len = AwdString.getUTFBytesLength(attr_val), writer.U32(attr_len), writer.writeUTFBytes(attr_val);
                    break;

                  case Consts.INT8:
                    writer.U32(1), writer.I8(attr_val);
                    break;

                  case Consts.INT16:
                    writer.U32(2), writer.I16(attr_val);
                    break;

                  case Consts.INT32:
                    writer.U32(4), writer.I32(attr_val);
                    break;

                  case Consts.BOOL:
                  case Consts.UINT8:
                    writer.U32(1), writer.U8(attr_val);
                    break;

                  case Consts.UINT16:
                    writer.U32(2), writer.U16(attr_val);
                    break;

                  case Consts.UINT32:
                  case Consts.BADDR:
                    writer.U32(4), writer.U32(attr_val);
                    break;

                  case Consts.FLOAT32:
                    writer.U32(4), writer.F32(attr_val);
                    break;

                  case Consts.FLOAT64:
                    writer.U32(8), writer.F64(attr_val);
                    break;

                  default:
                    throw new Error("UserAttribute unsupported type");
                }
            }
            writer.writeBlockSize(sptr);
        }
    }, module.exports = UserAttributes;
}();