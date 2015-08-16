/**
 * User: plepers
 * Date: 27/10/2014 16:00
 *
 * Precompute geometries boundingbox, write them as geometries properties
 */


var Consts = require( 'consts' );

module.exports = function( awd ){

  var geoms = awd.getDatasByType( Consts.GEOMETRY );


  var i, j;
  for (i = 0, j = geoms.length; i < j; i++) {
    var geom = geoms[i];

    var k, l;
    for (k = 0, l = geom.subGeoms.length; k < l; k++) {
      var subgeom = geom.subGeoms[k];

      var buffer = subgeom.getBuffersByType( [Consts.POSITION] )[0];




      if( buffer.components !== 3 ) {
        throw new Error( "invalid number of components, should be 3, is "+ buffer.components  );
      }

      var bdata = buffer.data;
      var o, r;

      var minx,miny, minz,
          maxx,maxy, maxz;


      minx = maxx = bdata[0];
      miny = maxy = bdata[1];
      minz = maxz = bdata[2];

      for (o = 3, r = bdata.length; o < r; o+=3) {
        minx = Math.min( minx, bdata[o] );
        maxx = Math.max( maxx, bdata[o] );

        miny = Math.min( miny, bdata[o+1] );
        maxy = Math.max( maxy, bdata[o+1] );

        minz = Math.min( minz, bdata[o+2] );
        maxz = Math.max( maxz, bdata[o+2] );
      }



      var geomType = awd.header.geoNrType;
      //var accuracy = awd.header.accuracyGeo;


      var props = subgeom.props;
      props.expected[10] =
      props.expected[11] =
      props.expected[12] =
      props.expected[13] =
      props.expected[14] =
      props.expected[15] = geomType;

      props.set( 10, minx );
      props.set( 11, miny );
      props.set( 12, minz );
      props.set( 13, maxx );
      props.set( 14, maxy );
      props.set( 15, maxz );


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