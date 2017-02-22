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
        write: void 0
    }, module.exports = UserAttributes;
}();