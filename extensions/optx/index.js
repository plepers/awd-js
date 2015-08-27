


module.exports = function( awdlib ) {

  require( 'optx/_awdlib' ).set( awdlib );

  return {
    Camera :            require( 'optx/Camera' ),
    CompositeTexture :  require( 'optx/CompositeTexture' ),
    Container :         require( 'optx/Container' ),
    Env :               require( 'optx/Env' ),
    Geometry :          require( 'optx/Geometry' ),
    Light :             require( 'optx/Light' ),
    Material :          require( 'optx/Material' ),
    Mesh :              require( 'optx/Mesh' ),
    Post :              require( 'optx/Post' ),
    Sky :               require( 'optx/Sky' ),
    Texture :           require( 'optx/Texture' ),
    FileData :          require( 'optx/FileData' ),
    ext :               require( 'optx/ext' ),
    extInfos :          require( 'optx/extInfos' )
  };

};

