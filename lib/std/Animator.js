!function() {
    var Properties = require("../types/properties"), AwdString = require("../types/awdString"), Consts = require("../consts"), UserAttr = require("../types/userAttr"), BaseElement = require("../BaseElement"), Animator = BaseElement.createStruct(Consts.ANIMATOR, null, {
        init: function() {
            this.name = "", this.model = Consts.MODEL_ANIMATOR, this.extras = new UserAttr(), 
            this.animatorProps = new UserAttr(), this.animatorProps = new Properties({
                1: Consts.AWD_FIELD_BADDR
            }), this.props = new Properties({}), this.targets = [], this.skeleton = null, this.animationSet = null, 
            this.activeState = 0, this.autoPlay = !1;
        },
        read: function(reader) {
            var match;
            this.name = AwdString.read(reader);
            var type = reader.U16();
            this.animatorProps.read(reader);
            var animSetId = reader.U32(), numTarget = reader.U16();
            this.targets = [];
            for (var i = 0; numTarget > i; i++) {
                var tgtId = reader.U32();
                if (match = this.awd.getAssetByID(tgtId, [ Consts.MODEL_MESH ]), !match[0]) throw new Error("Animator cannot find target reference");
                this.targets.push(match[1]);
            }
            if (this.activeState = reader.U16(), this.autoPlay = 0 !== reader.U8(), this.props.read(reader), 
            this.extras.read(reader), match = this.awd.getAssetByID(animSetId, [ Consts.MODEL_ANIMATION_SET ]), 
            !match[0]) throw new Error("Animator cannot find AnimationSet reference");
            if (this.animationSet = match[1], 1 === type) {
                var skeletonId = this.animatorProps.get(1, 0);
                if (match = this.awd.getAssetByID(skeletonId, [ Consts.MODEL_SKELETON ]), !match[0]) throw new Error("Animator cannot find Skeleton reference");
                this.skeleton = match[1];
            }
        },
        write: function(writer) {
            AwdString.write(this.name, writer), writer.U16(1), this.animatorProps.set(1, this.skeleton.chunk.id), 
            this.animatorProps.write(writer), writer.U32(this.animationSet.chunk.id), writer.U16(this.targets.length);
            for (var i = 0; i < this.targets.length; i++) writer.U32(this.targets[i].chunk.id);
            writer.U16(this.activeState), writer.U8(this.autoPlay ? 1 : 0), this.props.write(writer), 
            this.extras.write(writer);
        },
        getDependencies: function() {
            for (var res = [ this.skeleton, this.animationSet ], i = 0; i < this.targets.length; i++) res.push(this.targets[i]);
            return res;
        },
        toString: function() {
            return "[Animator" + this.name + "]";
        }
    });
    module.exports = Animator;
}();