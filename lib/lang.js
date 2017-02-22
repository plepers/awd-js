!function() {
    var __hasProp = {}.hasOwnProperty, __defProp = Object.defineProperty, __extend = function(child, parent) {
        function Ctor() {
            this.constructor = child;
        }
        for (var key in parent) __hasProp.call(parent, key) && (child[key] = parent[key]);
        Ctor.prototype = parent.prototype, child.prototype = new Ctor(), child.__super__ = parent.prototype;
    }, __getset = function(obj, prop, _get, _set) {
        __defProp(obj, prop, {
            get: _get,
            set: _set
        });
    };
    return {
        extend: __extend,
        getset: __getset
    };
}();