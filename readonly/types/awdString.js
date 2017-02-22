module.exports = {
    read: function(reader) {
        var l = reader.U16();
        return reader.readUTFBytes(l);
    },
    write: function(string, writer) {
        writer.U16(string.length), writer.writeUTFBytes(string);
    },
    getUTFBytesLength: function(string) {
        for (var res = 0, i = 0, j = string.length; j > i; i++) {
            var neededBytes, charCode = string[i].codePointAt(0);
            128 > charCode ? neededBytes = 1 : 2048 > charCode ? neededBytes = 2 : 65536 > charCode ? neededBytes = 3 : 2097152 > charCode && (neededBytes = 4), 
            res += neededBytes;
        }
        return res;
    }
};