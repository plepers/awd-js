/**
 * User: plepers
 * Date: 27/10/2014 14:46
 *
 * Apply matrix transformation on geometries buffers
 */

var Consts = require( 'consts' );

function xform1C( bdata, mtx ){
  var o, r;

  for (o = 1, r = bdata.length; o < r; o++) {
    bdata[o] = mtx[0] * bdata[o] + mtx[5];
  }

}

function xform2C( bdata, mtx ){
  var o, r;


  for (o = 1, r = bdata.length; o < r; o+=2) {

    var x = bdata[o],
        y = bdata[o+1];

    bdata[o+0] = mtx[0]  * x + mtx[2]  * y + mtx[5];
    bdata[o+1] = mtx[6]  * x + mtx[7]  * y + mtx[10];

  }
}

function xform3C( bdata, mtx ){
  var o, r;


  for (o = 1, r = bdata.length; o < r; o+=3) {

    var x = bdata[o],
        y = bdata[o+1],
        z = bdata[o+2];

    bdata[o+0] = mtx[0]  * x + mtx[2]  * y + mtx[3]  * z + mtx[5];
    bdata[o+1] = mtx[6]  * x + mtx[7]  * y + mtx[8]  * z + mtx[10];
    bdata[o+2] = mtx[11] * x + mtx[12] * y + mtx[13] * z + mtx[15];

  }

}

function xform4C( bdata, mtx ){
  var o, r;


  for (o = 1, r = bdata.length; o < r; o+=4) {

    var x = bdata[o],
        y = bdata[o+1],
        z = bdata[o+2],
        w = bdata[o+3];

    bdata[o+0] = mtx[0]  * x + mtx[2]  * y + mtx[3]  * z + mtx[4]  * w + mtx[5];
    bdata[o+1] = mtx[6]  * x + mtx[7]  * y + mtx[8]  * z + mtx[9]  * w + mtx[10];
    bdata[o+2] = mtx[11] * x + mtx[12] * y + mtx[13] * z + mtx[14] * w + mtx[15];
    bdata[o+3] = mtx[16] * x + mtx[17] * y + mtx[18] * z + mtx[19] * w + mtx[20];

  }
}

var xformMethods = [
  null,
  xform1C,
  xform2C,
  xform3C,
  xform4C
];



/*
 * Apply 5x4 matrix to arbitrary buffers.
 * Buffers can have 1 to 4 components
 * Matrix is row major, translation/offset component are mtx[5], mtx[10], mtx[15], mtx[20]
 */
module.exports = function( awd, mtx, types ){
  var i, j, k, l, m, n;


  var geoms = awd.getDatasByType( Consts.GEOMETRY );

  for (i = 0, j = geoms.length; i < j; i++) {
    var geom = geoms[i];

    for (k = 0, l = geom.subGeoms.length; k < l; k++) {
      var subgeom = geom.subGeoms[k];

      var buffers = subgeom.getBuffersByType( types );


      for (m = 0, n = buffers.length; m < n; m++) {
        var buffer = buffers[m],
            comps = buffer.components,
            bdata = buffer.data;

        if( comps < 1 || comps > 4 ) {
          throw new Error( "invalid number of components, must be [1-4], is "+ comps  );
        }

        xformMethods[comps]( bdata, mtx );

      }

    }

  }
};