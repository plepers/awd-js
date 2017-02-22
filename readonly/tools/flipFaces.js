var Consts = require("../consts");

module.exports = function(awd) {
    var i, j, geoms = awd.getDatasByType(Consts.GEOMETRY);
    for (i = 0, j = geoms.length; j > i; i++) {
        var k, l, geom = geoms[i];
        for (k = 0, l = geom.subGeoms.length; l > k; k++) {
            var m, n, subgeom = geom.subGeoms[k], buffers = subgeom.getBuffersByType(Consts.INDEX);
            for (m = 0, n = buffers.length; n > m; m++) {
                var o, r, tmp, buffer = buffers[m], bdata = buffer.data;
                for (o = 1, r = bdata.length; r > o; o += 3) tmp = bdata[o], bdata[o] = bdata[o + 1], 
                bdata[o + 1] = tmp;
            }
        }
    }
};