
expect = require( 'expect.js' );

module.exports = function( a, b )
{
  var a = new Uint8Array( a.buffer, a.byteOffset, a.byteLength );
  var b = new Uint8Array( b.buffer, b.byteOffset, b.byteLength );

  expect( a.byteLength ).to.be.equal( b.byteLength );

  for (var i = 0; i < a.length; i++) {
    expect( a[i] ).to.be.equal( b[i] );
  }
}