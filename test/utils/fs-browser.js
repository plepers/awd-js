
exports = module.exports = {

  readFile : function( file, cbk ){


    var request = new XMLHttpRequest();

    request.open( 'GET', file, true );
    request.responseType = "arraybuffer";

    request.addEventListener( 'load', function ( event ) {

        cbk( null, request.response );

    }, false );

    request.addEventListener( 'error', function ( event ) {

        cbk( event, null );

    }, false );


    request.send( null );

  }

};