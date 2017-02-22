var Header = require("./header"), Writer = require("./writer"), Consts = require("./consts"), Chunk = require("./chunk"), BufferReader = require("./bufferReader"), DefaultElement = require("./DefaultElement"), AWD = function() {
    this.header = new Header(), this._elements = [], this._elementsById = [], this._extensions = [];
};

AWD.prototype = {
    addElement: function(element) {
        this._elements.push(element), this._elementsById[element.id] = element;
    },
    removeElement: function(element) {
        var index = this._elements.indexOf(element);
        index > -1 && this._elements.splice(index, 1);
    },
    parse: function(buffer) {
        var chunk, reader = new BufferReader(buffer);
        for (this.header.read(reader); reader.bytesAvailable() > 0; ) chunk = this.parseChunk(reader);
    },
    write: function() {
        return Writer.write(this);
    },
    registerNamespace: function(namespace) {
        var ext = this.getExtension(namespace.uri);
        ext && (ext.nsId = namespace.nsId);
    },
    addExtension: function(ext) {
        if (null === this.getExtension(ext.nsUri)) {
            var id, extLen = this._extensions.push(ext), ns = ext.createNamespace();
            null !== ext.nsUri ? (id = extLen + 1, this.addElement(ns)) : id = 0, ns.nsId = ext.nsId = id;
        }
    },
    getExtension: function(nsUri) {
        for (var exts = this._extensions, i = 0, l = exts.length; l > i; i++) if (exts[i].nsUri === nsUri) return exts[i];
        return null;
    },
    getExtensionById: function(nsId) {
        for (var exts = this._extensions, i = 0, l = exts.length; l > i; i++) if (exts[i].nsId === nsId) return exts[i];
        return null;
    },
    getDatasByType: function(type, nsUri, res) {
        void 0 === nsUri && (nsUri = null), void 0 === res && (res = []);
        var i, l;
        if (type instanceof Array) for (i = 0, l = type.length; l > i; i++) this.getDatasByType(type[i], nsUri, res); else for (i = 0, 
        l = this._elements.length; l > i; i++) this._elements[i].type === type && this._elements[i].nsUri === nsUri && res.push(this._elements[i]);
        return res;
    },
    getAssetByID: function(assetID, assetTypesToGet) {
        var returnArray = [], typeCnt = 0, _elements = this._elementsById;
        if (assetID > 0 && _elements[assetID]) for (;typeCnt < assetTypesToGet.length; ) {
            if (0 !== (_elements[assetID].model & assetTypesToGet[typeCnt])) return returnArray.push(!0), 
            returnArray.push(_elements[assetID]), returnArray;
            if (assetTypesToGet[typeCnt] === Consts.MODEL_GEOMETRY && 0 !== (_elements[assetID].model & Consts.MODEL_MESH)) return returnArray.push(!0), 
            returnArray.push(_elements[assetID].geometry), returnArray;
            typeCnt++;
        }
        return returnArray.push(!1), returnArray.push(null), returnArray;
    },
    parseChunk: function(reader) {
        var chunk = new Chunk();
        chunk.read(reader);
        var data = this.structFactory(chunk), p = reader.ptr;
        data.read(reader), reader.ptr - p !== chunk.size && (console.log("Warn bad block parsing , byte delta : ", chunk.type, chunk.ns, reader.ptr - p - chunk.size), 
        reader.ptr = p + chunk.size), chunk.ns === Consts.DEFAULT_NS && chunk.type === Consts.NAMESPACE && this.registerNamespace(data), 
        this.addElement(data);
    },
    structFactory: function(chunk) {
        var struct, ext = this.getExtensionById(chunk.ns);
        return struct = ext ? ext.create(chunk.type) : new DefaultElement(), struct._setup(this, chunk), 
        struct;
    },
    resolveNamespace: function(elem) {
        if (null == elem.nsUri) return 0;
        var ext = this.getExtension(elem.nsUri);
        return ext ? ext.nsId : (console.log("Missing extension " + elem.nsUri), 0);
    }
}, module.exports = AWD;