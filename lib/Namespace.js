!function() {
    var AwdString = require("./types/awdString"), Consts = require("./consts"), BaseElement = require("./BaseElement"), Namespace = BaseElement.createStruct(Consts.NAMESPACE, null, {
        init: function() {
            this.uri = "", this.nsId = 0;
        },
        read: function(reader) {
            this.nsId = reader.U8(), this.uri = AwdString.read(reader);
        },
        write: function(writer) {
            writer.U8(this.nsId), AwdString.write(this.uri, writer);
        }
    });
    module.exports = Namespace;
}();