
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD.
      define([], factory);
  } else if (typeof exports === 'object') {
      // Node.
      module.exports = factory();
  } else {
      // Browser globals (root is window)
      root.AWD = factory();
  }
}(this, function () {

  var AWD = require( './awd' );

  return AWD;

}));
