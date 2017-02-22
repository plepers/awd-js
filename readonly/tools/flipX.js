var Consts = require("../consts");

module.exports = function(awd) {
    var geoms = awd.getDatasByType(Consts.GEOMETRY);
    console.log(geoms.length);
    var i, j;
    for (i = 0, j = geoms.length; j > i; i++) {
        var k, l, geom = geoms[i];
        for (k = 0, l = geom.subGeoms.length; l > k; k++) {
            var m, n, subgeom = geom.subGeoms[k], buffers = subgeom.getBuffersByType([ Consts.POSITION, Consts.NORMAL, Consts.TANGENT ]);
            for (m = 0, n = buffers.length; n > m; m++) {
                var buffer = buffers[m];
                if (3 !== buffer.components) throw new Error("invalid number of components, should be 3, is " + buffer.components);
                var o, r, bdata = buffer.data;
                for (o = 0, r = bdata.length; r > o; o += 3) bdata[o] = -bdata[o];
            }
        }
    }
};