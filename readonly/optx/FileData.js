function FileData() {
    this.data = null, this.mime = "application/octet-stream", this.uri = "";
}

var AwdString = require("../types/awdString");

FileData.prototype.read = function(reader) {
    this.mime = AwdString.read(reader), this.uri = AwdString.read(reader);
    var data_len = reader.U32();
    this.data = reader.subArray(data_len);
}, module.exports = FileData;