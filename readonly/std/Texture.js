!function() {
    var Properties = require("../types/properties"), AwdString = require("../types/awdString"), Consts = require("../consts"), UserAttr = require("../types/userAttr"), BaseElement = require("../BaseElement"), Texture = BaseElement.createStruct(Consts.TEXTURE, null, {
        init: function() {
            this.name = "", this.textype = 0, this.url = null, this.data = null, this.extras = new UserAttr(), 
            this.model = Consts.MODEL_TEXTURE;
        },
        read: function(reader) {
            this.name = AwdString.read(reader), this.textype = reader.U8();
            var str_len = reader.U32();
            0 === this.textype ? this.url = reader.readUTFBytes(str_len) : (this.data = new ArrayBuffer(str_len), 
            reader.readBytes(this.data, str_len)), new Properties().read(reader), this.extras.read(reader);
        },
        write: void 0,
        toString: function() {}
    });
    module.exports = Texture;
}();