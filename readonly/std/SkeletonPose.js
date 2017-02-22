!function() {
    function JointTransform() {
        this.hasTransform = !1, this.transform = new Matrix4();
    }
    var Properties = require("../types/properties"), AwdString = require("../types/awdString"), Consts = require("../consts"), UserAttr = require("../types/userAttr"), Matrix4 = require("../types/matrix"), BaseElement = require("../BaseElement"), SkeletonPose = BaseElement.createStruct(Consts.SKELETON_POSE, null, {
        init: function() {
            this.name = "", this.model = Consts.MODEL_SKELETON_POSE, this.extras = new UserAttr(), 
            this.props = new Properties({}), this.transforms = [];
        },
        read: function(reader) {
            this.name = AwdString.read(reader);
            var numTransforms = reader.U16();
            this.props.read(reader), this.transforms = [];
            for (var i = 0; numTransforms > i; i++) {
                var transform = new JointTransform();
                transform.read(this.awd, reader), this.transforms.push(transform);
            }
            this.extras.read(reader);
        },
        write: void 0,
        toString: function() {
            return "[SkeletonPose" + this.name + "]";
        }
    });
    JointTransform.prototype = {
        read: function(awd, reader) {
            this.hasTransform = 0 !== reader.U8(), this.transform.read(awd, reader);
        },
        write: void 0
    }, module.exports = SkeletonPose;
}();