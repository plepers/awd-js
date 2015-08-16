(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD.
      define([], factory);
  } else if (typeof exports === 'object') {
      // Node.
      module.exports = factory();
  } else {
      // Browser globals (root is window)
      root.<%= moduleNs %> = factory();
  }
}(this, function () {

  <%= tpl_imports %>

  var module = {
    <%= tpl_members %>
  };

  return module;

}));
