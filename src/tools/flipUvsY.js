/**
 * User: plepers
 * Date: 27/10/2014 14:46
 */

var Consts = require( '../consts' );

module.exports = function( awd ){



  geoms = awd.getDatasByType( Consts.GEOMETRY );

  var i, j;
  for (i = 0, j = geoms.length; i < j; i++) {
    var geom = geoms[i];

    var k, l;
    for (k = 0, l = geom.subGeoms.length; k < l; k++) {
      var subgeom = geom.subGeoms[k];

      var buffers = subgeom.getBuffersByType( Consts.UVS );

      var m, n;
      for (m = 0, n = buffers.length; m < n; m++) {
        var buffer = buffers[m];


        if( buffer.components != 2 ) {
          throw new Error( "invalid number of components, should be 3, is "+ buffer.components  );
        }

        var bdata = buffer.data;
        var o, r;
        for (o = 1, r = bdata.length; o < r; o+=2) {
          bdata[o] = 1.0-bdata[o];
        }


      }

    }

  }
}