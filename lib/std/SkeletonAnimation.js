!function() {
    function AnimationFrame() {
        this.pose = null, this.duration = 16;
    }
    var Properties = require("../types/properties"), AwdString = require("../types/awdString"), Consts = require("../consts"), UserAttr = require("../types/userAttr"), BaseElement = require("../BaseElement"), SkeletonAnimation = BaseElement.createStruct(Consts.SKELETON_ANIMATION, null, {
        init: function() {
            this.name = "", this.model = Consts.MODEL_ANIMATION_STATE, this.extras = new UserAttr(), 
            this.props = new Properties({}), this.frames = [];
        },
        read: function(reader) {
            this.name = AwdString.read(reader);
            var numFrames = reader.U16();
            this.props.read(reader), this.frames = [];
            for (var i = 0; numFrames > i; i++) {
                var frame = new AnimationFrame();
                frame.read(this.awd, reader), this.frames.push(frame);
            }
            this.extras.read(reader);
        },
        write: function(writer) {
            AwdString.write(this.name, writer), writer.U16(this.frames.length), this.props.write(writer);
            for (var i = 0; i < this.frames.length; i++) this.frames[i].write(this.awd, writer);
            this.extras.write(writer);
        },
        getDependencies: function() {
            for (var res = [], fl = this.frames.length, i = 0; fl > i; i++) {
                var frame = this.frames[i];
                res.push(frame.pose);
            }
            return res;
        },
        toString: function() {
            return "[SkeletonAnimation" + this.name + "]";
        }
    });
    AnimationFrame.prototype = {
        read: function(awd, reader) {
            var poseId = reader.U32();
            this.duration = reader.U16();
            var match = awd.getAssetByID(poseId, [ Consts.MODEL_SKELETON_POSE ]);
            if (!match[0]) throw new Error("SkeletonAnimation frame cannot find Pose reference");
            this.pose = match[1];
        },
        write: function(awd, writer) {
            writer.U32(this.pose.chunk.id), writer.U16(this.duration);
        }
    }, module.exports = SkeletonAnimation;
}();