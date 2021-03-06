var BaseElement = require("../BaseElement"), UserAttr = require("../types/userAttr"), AwdString = require("../types/awdString"), Properties = require("../types/properties"), Consts = require("../consts"), ExtInfos = require("./extInfos"), kP_blend = 1, kP_alphaThreshold = 2, kP_dithering = 3, kP_fresnel = 4, kP_horizonOcclude = 5, kP_vertexColor = 6, kP_vertexColorAlpha = 7, kP_vertexColorSRGB = 8, kP_aniso = 9, kP_anisoStrength = 10, kP_anisoIntegral = 11, kP_anisoTangent = 12, kP_subsurface = 13, kP_subsurfaceColor = 14, kP_transColor = 15, kP_fresnelColor = 16, kP_fresnelOcc = 17, kP_fresnelGlossMask = 18, kP_transSky = 19, kP_shadowBlur = 20, kP_normalSmooth = 21, kP_unlit = 22, pStruct = {};

pStruct[kP_blend] = Consts.AWD_FIELD_STRING, pStruct[kP_alphaThreshold] = Consts.AWD_FIELD_FLOAT32, 
pStruct[kP_dithering] = Consts.AWD_FIELD_BOOL, pStruct[kP_fresnel] = Consts.AWD_FIELD_FLOAT32, 
pStruct[kP_horizonOcclude] = Consts.AWD_FIELD_FLOAT32, pStruct[kP_vertexColor] = Consts.AWD_FIELD_BOOL, 
pStruct[kP_vertexColorAlpha] = Consts.AWD_FIELD_BOOL, pStruct[kP_vertexColorSRGB] = Consts.AWD_FIELD_BOOL, 
pStruct[kP_aniso] = Consts.AWD_FIELD_BOOL, pStruct[kP_anisoStrength] = Consts.AWD_FIELD_FLOAT32, 
pStruct[kP_anisoIntegral] = Consts.AWD_FIELD_FLOAT32, pStruct[kP_anisoTangent] = Consts.AWD_FIELD_FLOAT32, 
pStruct[kP_subsurface] = Consts.AWD_FIELD_BOOL, pStruct[kP_subsurfaceColor] = Consts.AWD_FIELD_FLOAT32, 
pStruct[kP_transColor] = Consts.AWD_FIELD_FLOAT32, pStruct[kP_fresnelColor] = Consts.AWD_FIELD_FLOAT32, 
pStruct[kP_fresnelOcc] = Consts.AWD_FIELD_FLOAT32, pStruct[kP_fresnelGlossMask] = Consts.AWD_FIELD_FLOAT32, 
pStruct[kP_transSky] = Consts.AWD_FIELD_FLOAT32, pStruct[kP_shadowBlur] = Consts.AWD_FIELD_FLOAT32, 
pStruct[kP_normalSmooth] = Consts.AWD_FIELD_FLOAT32, pStruct[kP_unlit] = Consts.AWD_FIELD_BOOL;

var Material = BaseElement.createStruct(ExtInfos.OPTX_MATERIAL, ExtInfos.URI, {
    init: function() {
        this.model = Consts.MODEL_MATERIAL, this.name = "", this.extras = new UserAttr(), 
        this.textures = {
            albedo: null,
            reflectivity: null,
            normal: null,
            subsurface: null,
            agt: null
        }, this.colors = {
            albedo: [ 0, 0, 0 ],
            reflectivity: [ 0, 0, 0 ],
            normal: [ 0, 0, 0 ],
            subsurface: [ 0, 0, 0 ],
            agt: [ 0, 0, 0 ]
        }, this.blend = "none", this.alphaThreshold = 0, this.dithering = !1, this.fresnel = [ 1, 1, 1 ], 
        this.horizonOcclude = 0, this.vertexColor = !1, this.vertexColorAlpha = !1, this.vertexColorSRGB = !1, 
        this.aniso = !1, this.anisoStrength = 1, this.anisoIntegral = .5, this.anisoTangent = [ 1, 0, 0 ], 
        this.subsurface = !1, this.subsurfaceColor = [ 1, 1, 1 ], this.transColor = [ 1, 0, 0, .5 ], 
        this.fresnelColor = [ .2, .2, .2, .5 ], this.fresnelOcc = 1, this.fresnelGlossMask = 1, 
        this.transSky = .5, this.shadowBlur = .5, this.normalSmooth = .5, this.unlit = !1;
    },
    read: function(reader) {
        this.name = AwdString.read(reader), this.textures.albedo = this.readTexture(reader), 
        this.textures.reflectivity = this.readTexture(reader), this.textures.normal = this.readTexture(reader), 
        this.textures.subsurface = this.readTexture(reader), this.textures.agt = this.readTexture(reader), 
        this.colors.albedo = [ reader.F32(), reader.F32(), reader.F32() ], this.colors.reflectivity = [ reader.F32(), reader.F32(), reader.F32() ], 
        this.colors.normal = [ reader.F32(), reader.F32(), reader.F32() ], this.colors.subsurface = [ reader.F32(), reader.F32(), reader.F32() ], 
        this.colors.agt = [ reader.F32(), reader.F32(), reader.F32() ];
        var props = new Properties(pStruct);
        props.read(reader), this.readProps(props), this.extras.read(reader);
    },
    writeColor: function(c, writer) {
        writer.F32(c[0]), writer.F32(c[1]), writer.F32(c[2]);
    },
    write: void 0,
    readTexture: function(reader) {
        var texId = reader.U32();
        if (texId > 0) {
            var match = this.awd.getAssetByID(texId, [ Consts.MODEL_TEXTURE ]);
            if (match[0]) return match[1];
            throw new Error("Could not find Texture for this Material, uid : " + texId);
        }
        return null;
    },
    writeTexture: void 0,
    setupProps: void 0,
    readProps: function(props) {
        this.blend = props.get(kP_blend, this.blend), this.alphaThreshold = props.get(kP_alphaThreshold, this.alphaThreshold), 
        this.dithering = !!props.get(kP_dithering, this.dithering), this.fresnel = props.get(kP_fresnel, this.fresnel), 
        this.horizonOcclude = props.get(kP_horizonOcclude, this.horizonOcclude), this.vertexColor = !!props.get(kP_vertexColor, this.vertexColor), 
        this.vertexColorAlpha = !!props.get(kP_vertexColorAlpha, this.vertexColorAlpha), 
        this.vertexColorSRGB = !!props.get(kP_vertexColorSRGB, this.vertexColorSRGB), this.aniso = !!props.get(kP_aniso, this.aniso), 
        this.anisoStrength = props.get(kP_anisoStrength, this.anisoStrength), this.anisoIntegral = props.get(kP_anisoIntegral, this.anisoIntegral), 
        this.anisoTangent = props.get(kP_anisoTangent, this.anisoTangent), this.subsurface = !!props.get(kP_subsurface, this.subsurface), 
        this.subsurfaceColor = props.get(kP_subsurfaceColor, this.subsurfaceColor), this.transColor = props.get(kP_transColor, this.transColor), 
        this.fresnelColor = props.get(kP_fresnelColor, this.fresnelColor), this.fresnelOcc = props.get(kP_fresnelOcc, this.fresnelOcc), 
        this.fresnelGlossMask = props.get(kP_fresnelGlossMask, this.fresnelGlossMask), this.transSky = props.get(kP_transSky, this.transSky), 
        this.shadowBlur = props.get(kP_shadowBlur, this.shadowBlur), this.normalSmooth = props.get(kP_normalSmooth, this.normalSmooth), 
        this.unlit = !!props.get(kP_unlit, this.unlit);
    },
    getDependencies: void 0,
    toString: function() {
        return "[Material " + this.pData.name + "]";
    }
});

module.exports = Material;