var Consts = require("../consts");

module.exports = function(awd) {
    var i, j, geoms = awd.getDatasByType(Consts.GEOMETRY);
    for (i = 0, j = geoms.length; j > i; i++) {
        var k, l, geom = geoms[i];
        for (k = 0, l = geom.subGeoms.length; l > k; k++) {
            var subgeom = geom.subGeoms[k], buffer = subgeom.getBuffersByType([ Consts.POSITION ])[0];
            if (3 !== buffer.components) throw new Error("invalid number of components, should be 3, is " + buffer.components);
            var o, r, minx, miny, minz, maxx, maxy, maxz, bdata = buffer.data;
            for (minx = maxx = bdata[0], miny = maxy = bdata[1], minz = maxz = bdata[2], o = 3, 
            r = bdata.length; r > o; o += 3) minx = Math.min(minx, bdata[o]), maxx = Math.max(maxx, bdata[o]), 
            miny = Math.min(miny, bdata[o + 1]), maxy = Math.max(maxy, bdata[o + 1]), minz = Math.min(minz, bdata[o + 2]), 
            maxz = Math.max(maxz, bdata[o + 2]);
            var geomType = awd.header.geoNrType, props = subgeom.props;
            props.expected[10] = props.expected[11] = props.expected[12] = props.expected[13] = props.expected[14] = props.expected[15] = geomType, 
            props.set(10, minx), props.set(11, miny), props.set(12, minz), props.set(13, maxx), 
            props.set(14, maxy), props.set(15, maxz);
        }
    }
};