function xform1C(bdata, mtx) {
    var o, r;
    for (o = 1, r = bdata.length; r > o; o++) bdata[o] = mtx[0] * bdata[o] + mtx[5];
}

function xform2C(bdata, mtx) {
    var o, r;
    for (o = 1, r = bdata.length; r > o; o += 2) {
        var x = bdata[o], y = bdata[o + 1];
        bdata[o + 0] = mtx[0] * x + mtx[2] * y + mtx[5], bdata[o + 1] = mtx[6] * x + mtx[7] * y + mtx[10];
    }
}

function xform3C(bdata, mtx) {
    var o, r;
    for (o = 1, r = bdata.length; r > o; o += 3) {
        var x = bdata[o], y = bdata[o + 1], z = bdata[o + 2];
        bdata[o + 0] = mtx[0] * x + mtx[2] * y + mtx[3] * z + mtx[5], bdata[o + 1] = mtx[6] * x + mtx[7] * y + mtx[8] * z + mtx[10], 
        bdata[o + 2] = mtx[11] * x + mtx[12] * y + mtx[13] * z + mtx[15];
    }
}

function xform4C(bdata, mtx) {
    var o, r;
    for (o = 1, r = bdata.length; r > o; o += 4) {
        var x = bdata[o], y = bdata[o + 1], z = bdata[o + 2], w = bdata[o + 3];
        bdata[o + 0] = mtx[0] * x + mtx[2] * y + mtx[3] * z + mtx[4] * w + mtx[5], bdata[o + 1] = mtx[6] * x + mtx[7] * y + mtx[8] * z + mtx[9] * w + mtx[10], 
        bdata[o + 2] = mtx[11] * x + mtx[12] * y + mtx[13] * z + mtx[14] * w + mtx[15], 
        bdata[o + 3] = mtx[16] * x + mtx[17] * y + mtx[18] * z + mtx[19] * w + mtx[20];
    }
}

var Consts = require("../consts"), xformMethods = [ null, xform1C, xform2C, xform3C, xform4C ];

module.exports = function(awd, mtx, types) {
    var i, j, k, l, m, n, geoms = awd.getDatasByType(Consts.GEOMETRY);
    for (i = 0, j = geoms.length; j > i; i++) {
        var geom = geoms[i];
        for (k = 0, l = geom.subGeoms.length; l > k; k++) {
            var subgeom = geom.subGeoms[k], buffers = subgeom.getBuffersByType(types);
            for (m = 0, n = buffers.length; n > m; m++) {
                var buffer = buffers[m], comps = buffer.components, bdata = buffer.data;
                if (1 > comps || comps > 4) throw new Error("invalid number of components, must be [1-4], is " + comps);
                xformMethods[comps](bdata, mtx);
            }
        }
    }
};