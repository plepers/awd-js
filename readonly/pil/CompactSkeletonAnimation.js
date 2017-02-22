function encodeFrame(data, ptr, frame) {
    for (var transforms = frame.transforms, i = 0; i < transforms.length; i++) ptr = encodePose(data, ptr, transforms[i]);
    return ptr;
}

function encodePose(data, ptr, pose) {
    var m4 = pose.transform.data;
    return encodeMat(data, ptr, m4), ptr + 7;
}

function encodeMat(data, ptr, m4) {
    data[ptr + 0] = m4[12], data[ptr + 1] = m4[13], data[ptr + 2] = m4[14];
    var sx = Math.sqrt(m4[0] * m4[0] + m4[1] * m4[1] + m4[2] * m4[2]), sy = Math.sqrt(m4[4] * m4[4] + m4[5] * m4[5] + m4[6] * m4[6]), sz = Math.sqrt(m4[8] * m4[8] + m4[9] * m4[9] + m4[10] * m4[10]);
    M3[0] = m4[0] / sx, M3[1] = m4[1] / sx, M3[2] = m4[2] / sx, M3[3] = m4[4] / sy, 
    M3[4] = m4[5] / sy, M3[5] = m4[6] / sy, M3[6] = m4[8] / sz, M3[7] = m4[9] / sz, 
    M3[8] = m4[10] / sz, quatFromMat3(data, ptr + 3, M3);
}

function quatFromMat3(out, ptr, m) {
    var fRoot, fTrace = m[0] + m[4] + m[8];
    if (fTrace > 0) fRoot = Math.sqrt(fTrace + 1), out[ptr + 3] = .5 * fRoot, fRoot = .5 / fRoot, 
    out[ptr + 0] = (m[5] - m[7]) * fRoot, out[ptr + 1] = (m[6] - m[2]) * fRoot, out[ptr + 2] = (m[1] - m[3]) * fRoot; else {
        var i = 0;
        m[4] > m[0] && (i = 1), m[8] > m[3 * i + i] && (i = 2);
        var j = (i + 1) % 3, k = (i + 2) % 3;
        fRoot = Math.sqrt(m[3 * i + i] - m[3 * j + j] - m[3 * k + k] + 1), out[ptr + i] = .5 * fRoot, 
        fRoot = .5 / fRoot, out[ptr + 3] = (m[3 * j + k] - m[3 * k + j]) * fRoot, out[ptr + j] = (m[3 * j + i] + m[3 * i + j]) * fRoot, 
        out[ptr + k] = (m[3 * k + i] + m[3 * i + k]) * fRoot;
    }
    return out;
}

var Properties = require("../types/properties"), AwdString = require("../types/awdString"), Consts = require("../consts"), UserAttr = require("../types/userAttr"), BaseElement = require("../BaseElement"), ExtInfos = require("./extInfos"), SkeletonAnimation = BaseElement.createStruct(ExtInfos.COMPACT_SKEL_ANIM, ExtInfos.URI, {
    init: function() {
        this.name = "", this.model = Consts.MODEL_ANIMATION_STATE, this.extras = new UserAttr(), 
        this.props = new Properties({}), this.numFrames = 0, this.numBones = 0, this.data = null;
    },
    read: function(reader) {
        this.name = AwdString.read(reader), this.numFrames = reader.U16(), this.numBones = reader.U16(), 
        this.props.read(reader);
        var padding = reader.U8();
        reader.ptr += padding;
        var numfloat = this.numFrames * this.numBones * 7;
        this.data = new Float32Array(reader.buffer, reader.ptr, numfloat), reader.ptr += 4 * numfloat, 
        this.extras.read(reader);
    },
    write: void 0,
    convertFromSkeletonAnimation: function(sanim) {
        var frames = sanim.frames;
        this.numFrames = frames.length, this.numBones = frames[0].pose.transforms.length, 
        this.data = new Float32Array(this.numFrames * this.numBones * 7);
        for (var ptr = 0, i = 0; i < frames.length; i++) ptr = encodeFrame(this.data, ptr, frames[i].pose);
    },
    toString: function() {
        return "[CompactSkeletonAnimation" + this.name + "]";
    }
}), M3 = new Float32Array(9);

module.exports = SkeletonAnimation;