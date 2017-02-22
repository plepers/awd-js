!function() {
    var Consts = require("../consts"), Properties = require("./properties"), Vec3 = function(x, y, z) {
        this.x = x || 0, this.y = y || 0, this.z = z || 0;
    };
    Vec3.prototype = {
        parsePivot: function(awd, reader) {
            var mtxType = awd.header.matrixNrType, props = new Properties({
                1: mtxType,
                2: mtxType,
                3: mtxType,
                4: Consts.UINT8
            });
            props.read(reader), this.x = props.get(1, 0), this.y = props.get(2, 0), this.z = props.get(3, 0);
        },
        writePivot: function(awd, writer) {
            var mtxType = awd.header.matrixNrType, props = new Properties({
                1: mtxType,
                2: mtxType,
                3: mtxType,
                4: Consts.UINT8
            });
            props.set(1, this.x), props.set(2, this.y), props.set(3, this.z), props.write(writer);
        }
    }, module.exports = Vec3;
}();