var BaseElement = require("../BaseElement"), UserAttr = require("../types/userAttr"), AwdString = require("../types/awdString"), Properties = require("../types/properties"), Consts = require("../consts"), ExtInfos = require("./extInfos"), FileData = require("./FileData"), kP_width = 1, kP_height = 2, kP_glinternalFormat = 3, kP_glformat = 4, kP_gltype = 5, pStruct = {};

pStruct[kP_width] = Consts.AWD_FIELD_UINT32, pStruct[kP_height] = Consts.AWD_FIELD_UINT32, 
pStruct[kP_glinternalFormat] = Consts.AWD_FIELD_UINT32, pStruct[kP_glformat] = Consts.AWD_FIELD_UINT32, 
pStruct[kP_gltype] = Consts.AWD_FIELD_UINT32;

var Texture = BaseElement.createStruct(ExtInfos.OPTX_TEXTURE, ExtInfos.URI, {
    init: function() {
        this.model = Consts.MODEL_TEXTURE, this.name = "", this.extras = new UserAttr(), 
        this.fileData = null, this.uri = null, this.infos = {};
    },
    read: function(reader) {
        this.name = AwdString.read(reader);
        var flags = reader.U8(), embed = !!(1 & flags);
        embed ? (this.fileData = new FileData(), this.fileData.read(reader)) : this.uri = AwdString.read(reader);
        var props = new Properties(pStruct);
        props.read(reader), this.readProps(props), this.extras.read(reader);
    },
    write: function(writer) {
        AwdString.write(this.name, writer);
        var isEmbed = null !== this.fileData, flags = +isEmbed;
        if (writer.U8(flags), isEmbed) this.fileData.write(writer); else {
            if (null === this.uri) throw new Error("Texture have no embedData nor uri");
            AwdString.write(this.uri, writer);
        }
        var props = new Properties(pStruct);
        this.setupProps(props), props.write(writer), this.extras.write(writer);
    },
    setupProps: function(props) {
        var infos = this.infos;
        props.set(kP_width, infos.width), props.set(kP_height, infos.height), props.set(kP_glinternalFormat, infos.glinternalFormat), 
        props.set(kP_glformat, infos.glformat), props.set(kP_gltype, infos.gltype);
    },
    readProps: function(props) {
        var infos = this.infos;
        infos.width = props.get(kP_width, infos.width), infos.height = props.get(kP_height, infos.height), 
        infos.glinternalFormat = props.get(kP_glinternalFormat, infos.glinternalFormat), 
        infos.glformat = props.get(kP_glformat, infos.glformat), infos.gltype = props.get(kP_gltype, infos.gltype);
    },
    getDependencies: function() {
        return null;
    },
    toString: function() {
        return "[Texture " + this.name + "]";
    }
});

module.exports = Texture;