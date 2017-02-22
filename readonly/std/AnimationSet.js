!function() {
    var Properties = require("../types/properties"), AwdString = require("../types/awdString"), Consts = require("../consts"), UserAttr = require("../types/userAttr"), BaseElement = require("../BaseElement"), AnimationSet = BaseElement.createStruct(Consts.ANIMATION_SET, null, {
        init: function() {
            this.name = "", this.model = Consts.MODEL_ANIMATION_SET, this.extras = new UserAttr(), 
            this.props = new Properties({}), this.animations = [];
        },
        read: function(reader) {
            this.name = AwdString.read(reader);
            var numAnims = reader.U16();
            this.props.read(reader), this.animations = [];
            for (var animation, i = 0; numAnims > i; i++) {
                var animId = reader.U32(), match = this.awd.getAssetByID(animId, [ Consts.MODEL_ANIMATION_STATE ]);
                if (!match[0]) throw new Error("AnimationSet cannot find animation state reference");
                animation = match[1], this.animations.push(animation);
            }
            this.extras.read(reader);
        },
        write: void 0,
        getDependencies: function() {
            for (var res = [], fl = this.animations.length, i = 0; fl > i; i++) {
                var anim = this.animations[i];
                res.push(anim);
            }
            return res;
        },
        toString: function() {
            return "[AnimationSet" + this.name + "]";
        }
    });
    module.exports = AnimationSet;
}();