/**
 * User: plepers
 * Date: 27/10/2014 14:46
 */

var Consts = require( '../consts' );

module.exports = function( awd ){



  var geoms = awd.getDatasByType( Consts.GEOMETRY );

  console.log( geoms.length );

  var i, j;
  for (i = 0, j = geoms.length; i < j; i++) {
    var geom = geoms[i];

    var k, l;
    for (k = 0, l = geom.subGeoms.length; k < l; k++) {
      var subgeom = geom.subGeoms[k];

      var buffers = subgeom.getBuffersByType( [Consts.POSITION, Consts.NORMAL, Consts.TANGENT ] );

      var m, n;
      for (m = 0, n = buffers.length; m < n; m++) {
        var buffer = buffers[m];


        if( buffer.components !== 3 ) {
          throw new Error( "invalid number of components, should be 3, is "+ buffer.components  );
        }

        var bdata = buffer.data;
        var o, r;
        for (o = 0, r = bdata.length; o < r; o+=3) {
          bdata[o] = -bdata[o];
        }


      }

    }

  }

//
//  var entities = awd.getDatasByType( [ Consts.CONTAINER, Consts.MESH ] );
//
//  // !!!! ignore pivot
//
//  for (i = 0, j = entities.length; i < j; i++) {
//    var entity = entities[i];
//
//
//    var matrix = entity.matrix;
//
//    matrix.data[12] = -matrix.data[12];
//  }

};