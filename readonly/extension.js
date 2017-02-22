var DefaultElement = require("./DefaultElement"), Namespace = require("./Namespace"), Extention = function(nsUri) {
    this.nsUri = nsUri, this.structs = [], this.nsId = 0;
};

Extention.prototype = {
    addStruct: function(struct) {
        this.structs.push(struct);
    },
    addStructs: function(structs) {
        for (var i = 0, l = structs.length; l > i; i++) this.addStruct(structs[i]);
    },
    create: function(type) {
        for (var Struct, structs = this.structs, i = 0, l = structs.length; l > i; i++) if (Struct = structs[i], 
        Struct.TYPE === type) return new Struct();
        return new DefaultElement();
    },
    createNamespace: function() {
        var ns = new Namespace();
        return ns.uri = this.nsUri, ns;
    }
}, module.exports = Extention;