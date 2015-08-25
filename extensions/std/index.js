


module.exports = function( awdlib ) {

  require( 'std/_awdlib' ).set( awdlib );

  return {
    Container   : require( 'std/Container' ),
    Geometry    : require( 'std/Geometry' ),
    Material    : require( 'std/Material' ),
    Mesh        : require( 'std/Mesh' ),
    Metadata    : require( 'std/Metadata' ),
    Primitive   : require( 'std/Primitive' ),
    Texture     : require( 'std/Texture' ),
    ext         : require( 'std/ext' )
  };

};

