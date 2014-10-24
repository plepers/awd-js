var Consts      = require( '../Consts' ),
    Properties  = require( './properties' ),
    Polys       = require( "polys" ),
    Vector3     = Polys.Vector3;



require('string.prototype.codepointat');

module.exports = {

  parsePivot : function( awd, reader ){

    var mtxType = awd.header.matrixNrType;

    var props = new Properties({
      1: mtxType,
      2: mtxType,
      3: mtxType,
      4: Consts.UINT8
    });

    props.read( reader );

    return new Vector3(
      props.get(1, 0),
      props.get(2, 0),
      props.get(3, 0)
    );

  },


  writePivot : function( pivot, awd, writer ){

    var mtxType = awd.header.matrixNrType;

    var props = new Properties({
      1: mtxType,
      2: mtxType,
      3: mtxType,
      4: Consts.UINT8
    });

    props.set( 1, pivot.x );
    props.set( 2, pivot.y );
    props.set( 3, pivot.z );

    props.write( writer );

  },






};