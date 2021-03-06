function readEffect(reader) {
    var fx, id = reader.U8();
    switch (id) {
      case POST_SHARPEN:
        fx = new Sharpen();
        break;

      case POST_BLOOM:
        fx = new Bloom();
        break;

      case POST_VIGNETTE:
        fx = new Vignette();
        break;

      case POST_SATURATION:
        fx = new Saturation();
        break;

      case POST_CONTRAST:
        fx = new Contrast();
        break;

      case POST_GRAIN:
        fx = new Grain();
        break;

      case POST_REINHARD:
        fx = new Reinhard();
        break;

      case POST_HEJL:
        fx = new Hejl();
        break;

      default:
        throw new Error("unknown post effect type " + id);
    }
    for (var i = 0; i < fx._l; i++) fx.props[i] = reader.F32();
    return fx;
}

function writeEffect(fx, writer) {
    writer.U8(fx._id);
    for (var i = 0; i < fx._l; i++) writer.F32(fx.props[i]);
}

function Sharpen(amount, limit) {
    this._l = 2, this._id = POST_SHARPEN, this.props = [ amount, limit ];
}

function Grain(amount, sharpness) {
    this._l = 2, this._id = POST_GRAIN, this.props = [ amount, sharpness ];
}

function Bloom(color, size) {
    this._l = 4, this._id = POST_BLOOM, color = color || [ 1, 1, 1 ], this.props = [ color[0], color[1], color[2], size ];
}

function Vignette(color, curve) {
    this._l = 5, this._id = POST_VIGNETTE, color = color || [ 1, 1, 1, 1 ], this.props = [ color[0], color[1], color[2], color[3], curve ];
}

function Saturation(rgb) {
    this._l = 3, this._id = POST_SATURATION, rgb = rgb || [ 1, 1, 1 ], this.props = [ rgb[0], rgb[1], rgb[2] ];
}

function Contrast(brightness, contrast, bias) {
    this._l = 9, this._id = POST_CONTRAST, brightness = brightness || [ 1, 1, 1 ], contrast = contrast || [ 1, 1, 1 ], 
    bias = bias || [ 1, 1, 1 ], this.props = [ brightness[0], brightness[1], brightness[2], contrast[0], contrast[1], contrast[2], bias[0], bias[1], bias[2] ];
}

function Reinhard() {
    this._l = 0, this._id = POST_REINHARD, this.props = [];
}

function Hejl() {
    this._l = 0, this._id = POST_HEJL, this.props = [];
}

var BaseElement = require("../BaseElement"), UserAttr = require("../types/userAttr"), AwdString = require("../types/awdString"), Consts = require("../consts"), ExtInfos = require("./extInfos"), Post = BaseElement.createStruct(ExtInfos.OPTX_POST, ExtInfos.URI, {
    init: function() {
        this.model = Consts.MODEL_GENERIC, this.name = "", this.effects = [], this.extras = new UserAttr();
    },
    read: function(reader) {
        this.name = AwdString.read(reader), this.effects = [];
        for (var numFx = reader.U8(), i = 0; numFx > i; i++) this.effects.push(readEffect(reader));
        this.extras.read(reader);
    },
    write: function(writer) {
        AwdString.write(this.name, writer);
        var numFx = this.effects.length;
        writer.U8(numFx);
        for (var i = 0; numFx > i; i++) writeEffect(this.effects[i], writer);
        this.extras.write(writer);
    },
    getDependencies: function() {
        return null;
    },
    toString: function() {
        return "[Post " + this.name + "]";
    }
}), POST_SHARPEN = 1, POST_BLOOM = 2, POST_VIGNETTE = 3, POST_SATURATION = 4, POST_CONTRAST = 5, POST_GRAIN = 6, POST_REINHARD = 7, POST_HEJL = 8;

Sharpen.prototype = {
    getAmount: function() {
        return this.props[0];
    },
    setAmount: function(v) {
        this.props[0] = v;
    },
    getLimit: function() {
        return this.props[1];
    },
    setLimit: function(v) {
        this.props[1] = v;
    }
}, Grain.prototype = {
    getAmount: function() {
        return this.props[0];
    },
    setAmount: function(v) {
        this.props[0] = v;
    },
    getsharpness: function() {
        return this.props[1];
    },
    setsharpness: function(v) {
        this.props[1] = v;
    }
}, Bloom.prototype = {
    getColor: function() {
        return this.props.slice(0, 3);
    },
    setColor: function(v) {
        this.props.splice(0, 3, v[0], v[1], v[2]);
    },
    getSize: function() {
        return this.props[1];
    },
    setSize: function(v) {
        this.props[1] = v;
    }
}, Vignette.prototype = {
    getColor: function() {
        return this.props.slice(0, 4);
    },
    setColor: function(v) {
        this.props.splice(0, 4, v[0], v[1], v[2], v[3]);
    },
    getCurve: function() {
        return this.props[1];
    },
    setCurve: function(v) {
        this.props[1] = v;
    }
}, Saturation.prototype = {
    getRgb: function() {
        return this.props;
    },
    setRgb: function(v) {
        this.props = v;
    }
}, Contrast.prototype = {
    getBrightness: function() {
        return this.props.slice(0, 3);
    },
    setBrightness: function(v) {
        this.props.splice(0, 3, v[0], v[1], v[2]);
    },
    getContrast: function() {
        return this.props.slice(3, 6);
    },
    setContrast: function(v) {
        this.props.splice(3, 3, v[0], v[1], v[2]);
    },
    getBias: function() {
        return this.props.slice(6, 9);
    },
    setBias: function(v) {
        this.props.splice(6, 3, v[0], v[1], v[2]);
    }
}, Reinhard.prototype = {}, Hejl.prototype = {}, Post.Sharpen = Sharpen, Post.Bloom = Bloom, 
Post.Vignette = Vignette, Post.Saturation = Saturation, Post.Contrast = Contrast, 
Post.Grain = Grain, Post.Reinhard = Reinhard, Post.Hejl = Hejl, module.exports = Post;