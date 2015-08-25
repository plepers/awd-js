
module.exports = function( awdlib ) {


  require( 'pil/_awdlib' ).set( awdlib );

  return {
    InterleavedGeometry :require( 'pil/InterleavedGeometry' ),
    ext                 :require( 'pil/ext' ),
    extInfos            :require( 'pil/extInfos' )
  };

};

