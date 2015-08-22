!function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a(); else if ("function" == typeof define && define.amd) define([], a); else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, 
        b.awdlib_pil = a();
    }
}(function() {
    var a;
    return function b(a, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!a[g]) {
                    var i = "function" == typeof require && require;
                    if (!h && i) return i(g, !0);
                    if (f) return f(g, !0);
                    var j = new Error("Cannot find module '" + g + "'");
                    throw j.code = "MODULE_NOT_FOUND", j;
                }
                var k = c[g] = {
                    exports: {}
                };
                a[g][0].call(k.exports, function(b) {
                    var c = a[g][1][b];
                    return e(c ? c : b);
                }, k, k.exports, b, a, c, d);
            }
            return c[g].exports;
        }
        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
        return e;
    }({
        1: [ function(require, module, exports) {
            var a = require("libawd"), b = a.BaseElement, c = a.bufferReader, d = a.consts, e = require("std/Geometry"), f = require("pil/extInfos"), g = function() {
                this.data = null, this.attributes = [], this.ftype = d.AWD_FIELD_FLOAT32;
            };
            g.HEAD_SIZE = 6, g.prototype = {
                allocate: function(a, b) {
                    var c = e.getArray(b);
                    this.data = new c(a);
                },
                read: function(a) {
                    var b = a.U8(), c = a.U8(), f = this.attributes;
                    this.ftype = c;
                    var g = 0;
                    this.isIndex = !1;
                    for (var h = 0; b > h; h++) {
                        var i = a.U8(), j = a.U8();
                        i === d.INDEX && (b > 1 && console.warn("interleaved index buffer is not alone"), 
                        this.isIndex = !0), g += j, f.push({
                            type: i,
                            len: j
                        });
                    }
                    var k = a.U8();
                    a.ptr += k;
                    var l = a.U32(), m = a.ptr + l, n = e.getTypeSize(c), o = l / n;
                    this.numVertices = o / g, this.allocate(o, c);
                    for (var p = e.getReadFunc(c, a), q = this.data, r = 0; a.ptr < m; ) q[r++] = p.call(a);
                },
                write: void 0
            };
            var h = function(a) {
                var b = new e.SubGeom();
                b.extras = a.extras.clone(), b.props = a.props.clone();
                for (var f, h, i, j = a.buffers, k = {}, l = 0, m = j.length; m > l; l++) h = j[l], 
                2 !== h.type ? (f = h.ftype, k[f] || (k[f] = {
                    list: [],
                    ftype: f
                }), k[f].list.push(h)) : (i = new g(), i.attributes.push({
                    type: 2,
                    len: 3
                }), i.data = h.data, i.ftype = d.AWD_FIELD_UINT16, i.isIndex = !0, b.buffers.push(i));
                for (var n in k) {
                    var o = k[n].list, p = o[0].numVertices;
                    f = k[n].ftype, i = new g(), b.buffers.push(i), i.ftype = f;
                    var q, r = [];
                    for (l = 0, m = o.length; m > l; l++) {
                        h = o[l];
                        var s = new c(h.data.buffer);
                        for (i.attributes.push({
                            type: h.type,
                            len: h.components
                        }), q = 0; q < h.components; q++) r.push(s);
                    }
                    var t = e.getArray(f), u = new t(r.length * p), v = e.getReadFunc(f, r[0]), w = 0;
                    for (l = 0; p > l; l++) for (q = 0, m = r.length; m > q; q++) u[w++] = v.call(r[q]);
                    i.data = u;
                }
                return b;
            }, i = b.createStruct(f.INTERLEAVED_GEOM, f.URI, e.prototype);
            i.prototype.fromGeometry = function(a) {
                this.name = a.name, this.extras = a.extras.clone(), this.props = a.props.clone();
                for (var b = 0, c = a.subGeoms.length; c > b; b++) {
                    var d = a.subGeoms[b];
                    this.subGeoms.push(h(d));
                }
            }, i.prototype.subGeomFactory = function() {
                var a = e.prototype.subGeomFactory();
                return a.bufferFactory = this.bufferFactory, a;
            }, i.prototype.bufferFactory = function() {
                return new g();
            }, i.prototype.toString = function() {
                return "[InterleavedGeometry " + this.name + "]";
            }, module.exports = i;
        }, {
            libawd: 5,
            "pil/extInfos": 3,
            "std/Geometry": 4
        } ],
        2: [ function(require, module, exports) {
            var a = require("libawd"), b = a.extension, c = require("pil/InterleavedGeometry"), d = require("pil/extInfos"), e = [ c ], f = d;
            f.getExtension = function() {
                var a = new b(d.URI);
                return a.addStructs(e), a;
            }, module.exports = f;
        }, {
            libawd: 5,
            "pil/InterleavedGeometry": 1,
            "pil/extInfos": 3
        } ],
        3: [ function(require, module, exports) {
            module.exports = {
                URI: "https://github.com/plepers/awd-js",
                INTERLEAVED_GEOM: 1
            };
        }, {} ],
        4: [ function(require, module, exports) {
            !function() {
                "use strict";
                var a = require("consts"), b = require("types/awdString"), c = require("types/userAttr"), d = require("types/properties"), e = require("BaseElement"), f = e.createStruct(a.GEOMETRY, null, {
                    subGeomFactory: function() {
                        var a = new g();
                        return a.bufferFactory = this.bufferFactory, a;
                    },
                    bufferFactory: function() {
                        return new i();
                    },
                    init: function() {
                        this.model = a.MODEL_GEOMETRY, this.name = "", this.extras = new c(), this.props = new d({}), 
                        this.subGeoms = [];
                    },
                    read: function(a) {
                        this.name = b.read(a);
                        var c = a.U16(), d = this.awd.header.geoNrType, e = this.props;
                        e.expected[1] = d, e.expected[2] = d, e.read(a);
                        var f = e.get(1, 1), g = e.get(2, 1);
                        (1 !== f || 1 !== g) && console.log("WARN defined scale UV in geometry");
                        for (var h, i = this.subGeoms, j = 0; c > j; j++) h = this.subGeomFactory(), h.read(this.awd, a), 
                        i.push(h);
                        this.extras.read(a);
                    },
                    write: void 0,
                    toString: function() {
                        return "[Geometry " + this.name + "]";
                    }
                }), g = function() {
                    this.buffers = [], this.extras = new c(), this.props = new d({});
                };
                g.prototype = {
                    getBuffersByType: function(a, b) {
                        void 0 === b && (b = []);
                        var c, d;
                        if (a instanceof Array) for (c = 0, d = a.length; d > c; c++) this.getBuffersByType(a[c], b); else for (c = 0, 
                        d = this.buffers.length; d > c; c++) this.buffers[c].type === a && b.push(this.buffers[c]);
                        return b;
                    },
                    read: function(a, b) {
                        var c = b.U32(), d = b.ptr + c, e = a.header.geoNrType, f = this.props;
                        f.expected[1] = e, f.expected[2] = e, f.read(b);
                        var g = f.get(1, 1), h = f.get(2, 1);
                        (1 !== g || 1 !== h) && console.log("WARN defined scale UV in sub-geometry");
                        for (var i, j = -1; b.ptr < d; ) i = this.bufferFactory(), i.read(b), !i.isIndex && i.numVertices > -1 && (j > -1 && i.numVertices !== j && console.log("Warn buffers in geom has differents num vertices", j, i.numVertices), 
                        j = i.numVertices), this.buffers.push(i);
                        -1 === j && console.log("Error, Can't resolve geom buffers sizes");
                        for (var k = 0, l = this.buffers.length; l > k; k++) i = this.buffers[k], -1 !== i.numVertices || i.isIndex || i.solveSize(j);
                        this.extras.read(b);
                    },
                    write: function(a, b) {
                        var c = b.skipBlockSize();
                        this.writeProps(a, b);
                        for (var d = 0, e = this.buffers.length; e > d; d++) {
                            var f = this.buffers[d];
                            f.write(b);
                        }
                        b.writeBlockSize(c), this.extras.write(b);
                    },
                    writeProps: function(a, b) {
                        var c = a.header.geoNrType, d = this.props;
                        d.expected[1] = c, d.expected[2] = c, d.set(1, 1), d.set(2, 1), d.write(b);
                    }
                };
                var h = function(b) {
                    return 2 === b ? a.AWD_FIELD_UINT16 : 4 === b ? a.AWD_FIELD_FLOAT32 : b;
                }, i = function() {
                    this.data = null, this.numVertices = -1, this.type = 0, this.components = 0, this.ftype = a.T_FLOAT, 
                    this.isIndex = !1;
                };
                i.HEAD_SIZE = 6, i.prototype = {
                    allocate: function(a, b) {
                        var c = m(b);
                        void 0 === c && console.log(b), this.data = new c(a);
                    },
                    solveSize: function(a) {
                        this.numVertices = a, this.components = this.data.length / a;
                    },
                    read: function(b) {
                        var c = b.U8(), d = b.U8(), e = b.U32(), f = b.ptr + e;
                        d = h(d), d !== a.AWD_FIELD_UINT16 && d !== a.AWD_FIELD_FLOAT32 && d !== a.AWD_FIELD_FLOAT64 && console.log("WARN unexpected stream data type ", d, c, e);
                        var g = n(c);
                        this.isIndex = c === a.INDEX, this.type = c, this.components = g, this.ftype = d;
                        var i = j(d), l = e / i;
                        -1 !== g && (this.numVertices = l / g), this.allocate(l, d);
                        for (var m = k(d, b), o = this.data, p = 0; b.ptr < f; ) o[p++] = m.call(b);
                    },
                    write: function(a) {
                        a.U8(this.type), a.U8(this.ftype);
                        for (var b = a.skipBlockSize(), c = l(this.ftype, a), d = this.data, e = 0, f = d.length; f > e; e++) c.call(a, d[e]);
                        a.writeBlockSize(b);
                    }
                };
                var j = function(b) {
                    switch (b) {
                      case a.AWD_FIELD_UINT16:
                        return 2;

                      case a.AWD_FIELD_FLOAT32:
                        return 4;

                      case a.AWD_FIELD_FLOAT64:
                        return 8;
                    }
                    throw new Error("WARN getTypeSize - unexpected stream data type " + b);
                }, k = function(b, c) {
                    switch (b) {
                      case a.AWD_FIELD_UINT16:
                        return c.U16;

                      case a.AWD_FIELD_FLOAT32:
                        return c.F32;

                      case a.AWD_FIELD_FLOAT64:
                        return c.F64;
                    }
                    throw new Error("WARN getReadFunc - unexpected stream data type " + b);
                }, l = function(b, c) {
                    switch (b) {
                      case a.AWD_FIELD_UINT16:
                        return c.U16;

                      case a.AWD_FIELD_FLOAT32:
                        return c.F32;

                      case a.AWD_FIELD_FLOAT64:
                        return c.F64;
                    }
                    throw new Error("WARN getWriteFunc - unexpected stream data type " + b);
                }, m = function(b) {
                    switch (b) {
                      case a.AWD_FIELD_UINT16:
                        return Uint16Array;

                      case a.AWD_FIELD_FLOAT32:
                        return Float32Array;

                      case a.AWD_FIELD_FLOAT64:
                        return Float64Array;
                    }
                    throw new Error("WARN getArray - unexpected stream data type " + b);
                }, n = function(b) {
                    switch (b) {
                      case a.POSITION:
                      case a.INDEX:
                      case a.NORMAL:
                      case a.TANGENT:
                        return 3;

                      case a.UVS:
                        return 2;

                      case a.JOIN_WGT:
                      case a.JOIN_IDX:
                        return -1;

                      default:
                        return -1;
                    }
                };
                f.SubGeom = g, f.VertexBuffer = i, f.getTypeSize = j, f.getReadFunc = k, f.getWriteFunc = l, 
                f.getArray = m, f.fixC4D_Type = h, module.exports = f;
            }();
        }, {
            BaseElement: 7,
            consts: 14,
            "types/awdString": 23,
            "types/properties": 25,
            "types/userAttr": 26
        } ],
        5: [ function(require, module, exports) {
            (function(b) {
                !function(c) {
                    if ("object" == typeof exports && "undefined" != typeof module) module.exports = c(); else if ("function" == typeof a && a.amd) a([], c); else {
                        var d;
                        d = "undefined" != typeof window ? window : "undefined" != typeof b ? b : "undefined" != typeof self ? self : this, 
                        d.libawd = c();
                    }
                }(function() {
                    return function a(b, c, d) {
                        function e(g, h) {
                            if (!c[g]) {
                                if (!b[g]) {
                                    var i = "function" == typeof require && require;
                                    if (!h && i) return i(g, !0);
                                    if (f) return f(g, !0);
                                    var j = new Error("Cannot find module '" + g + "'");
                                    throw j.code = "MODULE_NOT_FOUND", j;
                                }
                                var k = c[g] = {
                                    exports: {}
                                };
                                b[g][0].call(k.exports, function(a) {
                                    var c = b[g][1][a];
                                    return e(c ? c : a);
                                }, k, k.exports, a, b, c, d);
                            }
                            return c[g].exports;
                        }
                        for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
                        return e;
                    }({
                        1: [ function(require, module, exports) {
                            String.prototype.codePointAt || !function() {
                                "use strict";
                                var a = function() {
                                    try {
                                        var a = {}, b = Object.defineProperty, c = b(a, a, a) && b;
                                    } catch (d) {}
                                    return c;
                                }(), b = function(a) {
                                    if (null == this) throw TypeError();
                                    var b = String(this), c = b.length, d = a ? Number(a) : 0;
                                    if (d != d && (d = 0), 0 > d || d >= c) return void 0;
                                    var e, f = b.charCodeAt(d);
                                    return f >= 55296 && 56319 >= f && c > d + 1 && (e = b.charCodeAt(d + 1), e >= 56320 && 57343 >= e) ? 1024 * (f - 55296) + e - 56320 + 65536 : f;
                                };
                                a ? a(String.prototype, "codePointAt", {
                                    value: b,
                                    configurable: !0,
                                    writable: !0
                                }) : String.prototype.codePointAt = b;
                            }();
                        }, {} ],
                        2: [ function(require, module, exports) {
                            !function() {
                                var a = require("consts"), b = require("chunk"), c = {
                                    _setup: function(a, b) {
                                        this.awd = a, this.chunk = b, this.id = b.id;
                                    },
                                    init: function() {
                                        this.injectDeps = !1, this.model = a.MODEL_GENERIC;
                                    },
                                    getDependencies: function() {
                                        return this.deps ? this.deps : null;
                                    },
                                    prepareAndAdd: function(a, b) {
                                        if (!(b.indexOf(this) > -1)) {
                                            this.awd = a;
                                            var c = this.getDependencies();
                                            if (null !== c) for (var d = 0, e = c.length; e > d; d++) {
                                                var f = c[d];
                                                f.prepareAndAdd(a, b), this.injectDeps && -1 === a._elements.indexOf(f) && a.addElement(f);
                                            }
                                            this.injectDeps, this.id = b.length + 1;
                                            var g = a.resolveNamespace(this);
                                            g > -1 && (this.ns = g), this.prepareChunk(), this.chunk.id = this.id, b.push(this);
                                        }
                                    },
                                    prepareChunk: function() {
                                        null === this.chunk && (this.chunk = new b()), this.chunk.type = this.type, this.chunk.ns = this.ns;
                                    }
                                }, d = {};
                                d.createStruct = function(a, b, d) {
                                    var e = function() {
                                        this.type = a, this.nsUri = b, this.ns = 0, this.injectDeps = !0, this.init(), this.chunk = null, 
                                        this.id = -1;
                                    };
                                    e.TYPE = a;
                                    var f;
                                    for (f in c) e.prototype[f] = c[f];
                                    for (f in d) e.prototype[f] = d[f];
                                    return e;
                                }, module.exports = d;
                            }();
                        }, {
                            chunk: 8,
                            consts: 9
                        } ],
                        3: [ function(require, module, exports) {
                            var a = require("consts"), b = require("BaseElement"), c = b.createStruct(a.GENERIC, -1, {
                                read: function(a) {
                                    this.buf = new ArrayBuffer(this.chunk.size), a.readBytes(this.buf, this.chunk.size), 
                                    this.setDeps();
                                },
                                write: function(a) {
                                    a.writeBytes(this.buf, this.chunk.size);
                                },
                                setDeps: function() {
                                    for (var a, b = this.awd._elements, c = [], d = 0, e = b.length; e > d; d++) a = b[d], 
                                    c.push(a);
                                    this.deps = c;
                                },
                                prepareAndAdd: function(a, b) {
                                    if (!(b.indexOf(this) > -1)) {
                                        this.awd = a;
                                        for (var c = this.deps, d = 0, e = c.length; e > d; d++) c[d].prepareAndAdd(a, b);
                                        this.id = b.length + 1, b.push(this);
                                    }
                                },
                                prepareChunk: function() {}
                            });
                            module.exports = c;
                        }, {
                            BaseElement: 2,
                            consts: 9
                        } ],
                        4: [ function(require, module, exports) {
                            !function() {
                                var a = require("types/awdString"), b = require("consts"), c = require("BaseElement"), d = c.createStruct(b.NAMESPACE, null, {
                                    init: function() {
                                        this.uri = "", this.nsId = 0;
                                    },
                                    read: function(b) {
                                        this.nsId = b.U8(), this.uri = a.read(b);
                                    },
                                    write: function(b) {
                                        b.U8(this.nsId), a.write(this.uri, b);
                                    }
                                });
                                module.exports = d;
                            }();
                        }, {
                            BaseElement: 2,
                            consts: 9,
                            "types/awdString": 18
                        } ],
                        5: [ function(require, module, exports) {
                            var a = require("header"), b = require("writer"), c = require("consts"), d = require("chunk"), e = require("bufferReader"), f = require("DefaultElement"), g = function() {
                                this.header = new a(), this._elements = [], this._elementsById = [], this._extensions = [];
                            };
                            g.prototype = {
                                addElement: function(a) {
                                    this._elements.push(a), this._elementsById[a.id] = a;
                                },
                                removeElement: function(a) {
                                    var b = this._elements.indexOf(a);
                                    b > -1 && this._elements.splice(b, 1);
                                },
                                parse: function(a) {
                                    var b, c = new e(a);
                                    for (this.header.read(c); c.bytesAvailable() > 0; ) b = this.parseChunk(c);
                                },
                                write: function() {
                                    return b.write(this);
                                },
                                registerNamespace: function(a) {
                                    var b = this.getExtension(a.uri);
                                    b && (b.nsId = a.nsId);
                                },
                                addExtension: function(a) {
                                    if (null === this.getExtension(a.nsUri)) {
                                        var b, c = this._extensions.push(a), d = a.createNamespace();
                                        null !== a.nsUri ? (b = c + 1, this.addElement(d)) : b = 0, d.nsId = a.nsId = b;
                                    }
                                },
                                getExtension: function(a) {
                                    for (var b = this._extensions, c = 0, d = b.length; d > c; c++) if (b[c].nsUri === a) return b[c];
                                    return null;
                                },
                                getExtensionById: function(a) {
                                    for (var b = this._extensions, c = 0, d = b.length; d > c; c++) if (b[c].nsId === a) return b[c];
                                    return null;
                                },
                                getDatasByType: function(a, b, c) {
                                    void 0 === b && (b = null), void 0 === c && (c = []);
                                    var d, e;
                                    if (a instanceof Array) for (d = 0, e = a.length; e > d; d++) this.getDatasByType(a[d], b, c); else for (d = 0, 
                                    e = this._elements.length; e > d; d++) this._elements[d].type === a && this._elements[d].nsUri === b && c.push(this._elements[d]);
                                    return c;
                                },
                                getAssetByID: function(a, b) {
                                    var d = [], e = 0, f = this._elementsById;
                                    if (a > 0 && f[a]) for (;e < b.length; ) {
                                        if (0 !== (f[a].model & b[e])) return d.push(!0), d.push(f[a]), d;
                                        if (b[e] === c.MODEL_GEOMETRY && 0 !== (f[a].model & c.MODEL_MESH)) return d.push(!0), 
                                        d.push(f[a].geometry), d;
                                        e++;
                                    }
                                    return d.push(!1), d.push(null), d;
                                },
                                parseChunk: function(a) {
                                    var b = new d();
                                    b.read(a);
                                    var e = this.structFactory(b), f = a.ptr;
                                    e.read(a), a.ptr - f !== b.size && (console.log("Warn bad block parsing , byte delta : ", a.ptr - f - b.size), 
                                    a.ptr = f + b.size), b.ns === c.DEFAULT_NS && b.type === c.NAMESPACE && this.registerNamespace(e), 
                                    this.addElement(e);
                                },
                                structFactory: function(a) {
                                    var b, c = this.getExtensionById(a.ns);
                                    return b = c ? c.create(a.type) : new f(), b._setup(this, a), b;
                                },
                                resolveNamespace: function(a) {
                                    if (null == a.nsUri) return 0;
                                    var b = this.getExtension(a.nsUri);
                                    return b ? b.nsId : (console.log("Missing extension " + a.nsUri), 0);
                                }
                            }, module.exports = g;
                        }, {
                            DefaultElement: 3,
                            bufferReader: 6,
                            chunk: 8,
                            consts: 9,
                            header: 11,
                            writer: 23
                        } ],
                        6: [ function(require, module, exports) {
                            !function() {
                                var a = function(a, b, c) {
                                    this.buffer = a, this.ptr = 0, this.littleEndien = !0, b = b || 0, c = c || a.byteLength, 
                                    this.view = new DataView(a, b, c), this.length = this.view.byteLength;
                                };
                                a.prototype = {
                                    setPosition: function(a) {
                                        this.ptr = a;
                                    },
                                    setLittleEndian: function(a) {
                                        this.littleEndien = a;
                                    },
                                    bytesAvailable: function() {
                                        return this.length - this.ptr;
                                    },
                                    I8: function() {
                                        return this.view.getInt8(this.ptr++);
                                    },
                                    U8: function() {
                                        return this.view.getUint8(this.ptr++);
                                    },
                                    I16: function() {
                                        var a = this.view.getInt16(this.ptr, this.littleEndien);
                                        return this.ptr += 2, a;
                                    },
                                    U16: function() {
                                        var a = this.view.getUint16(this.ptr, this.littleEndien);
                                        return this.ptr += 2, a;
                                    },
                                    I32: function() {
                                        var a = this.view.getInt32(this.ptr, this.littleEndien);
                                        return this.ptr += 4, a;
                                    },
                                    U32: function() {
                                        var a = this.view.getUint32(this.ptr, this.littleEndien);
                                        return this.ptr += 4, a;
                                    },
                                    F32: function() {
                                        var a = this.view.getFloat32(this.ptr, this.littleEndien);
                                        return this.ptr += 4, a;
                                    },
                                    F64: function() {
                                        var a = this.view.getFloat64(this.ptr, this.littleEndien);
                                        return this.ptr += 8, a;
                                    },
                                    readBytes: function(a, b) {
                                        void 0 === b && (b = a.byteLength);
                                        var c = new Int8Array(a), d = new Int8Array(this.buffer, this.ptr, b);
                                        c.set(d), this.ptr += b;
                                    },
                                    subArray: function(a) {
                                        var b = new Int8Array(this.buffer, this.ptr, a);
                                        return this.ptr += a, b;
                                    },
                                    readUTFBytes: function(a) {
                                        for (var b, c, d, e = this.ptr + a, f = [], g = 0; this.ptr < e; ) b = this.U8(), 
                                        128 > b ? f[g++] = String.fromCharCode(b) : b > 191 && 224 > b ? (c = this.U8(), 
                                        f[g++] = String.fromCharCode((31 & b) << 6 | 63 & c)) : (c = this.U8(), d = this.U8(), 
                                        f[g++] = String.fromCharCode((15 & b) << 12 | (63 & c) << 6 | 63 & d));
                                        return f.join("");
                                    }
                                }, module.exports = a;
                            }();
                        }, {} ],
                        7: [ function(require, module, exports) {
                            require("string.prototype.codepointat");
                            var a = 65536, b = function() {
                                for (var a = [], b = 0; 5 > b; b++) a[b] = parseInt("1111".slice(0, b), 2);
                                return a;
                            }(), c = function(a) {
                                this.buffer = new ArrayBuffer(a), this.ptr = 0, this.littleEndien = !0, this.view = new DataView(this.buffer), 
                                this.length = this.view.byteLength, this.skips = [];
                            };
                            c.prototype = {
                                _ensureSize: function(a) {
                                    this.ptr + a > this.buffer.byteLength && this._realloc(a);
                                },
                                _realloc: function(b) {
                                    for (var c = this.buffer.byteLength, d = a; b > c + d; ) d += a;
                                    var e = c + d, f = new ArrayBuffer(e);
                                    new Int8Array(f).set(new Int8Array(this.buffer)), this.buffer = f, this.view = new DataView(f), 
                                    this.length = f.length;
                                },
                                skipBlockSize: function() {
                                    return this.ptr += 4, this.ptr;
                                },
                                writeBlockSize: function(a) {
                                    var b = this.ptr - a, c = this.ptr;
                                    this.ptr = a - 4, this.U32(b), this.ptr = c;
                                },
                                copy: function() {
                                    var a = new ArrayBuffer(this.ptr);
                                    return new Int8Array(a).set(new Int8Array(this.buffer, 0, this.ptr)), a;
                                },
                                setPosition: function(a) {
                                    this.ptr = a;
                                },
                                setLittleEndian: function(a) {
                                    this.littleEndien = a;
                                },
                                bytesAvailable: function() {
                                    return this.length - this.ptr;
                                },
                                I8: function(a) {
                                    return this._ensureSize(1), this.view.setInt8(this.ptr++, a);
                                },
                                U8: function(a) {
                                    return this._ensureSize(1), this.view.setUint8(this.ptr++, a);
                                },
                                I16: function(a) {
                                    this._ensureSize(2), this.view.setInt16(this.ptr, a, this.littleEndien), this.ptr += 2;
                                },
                                U16: function(a) {
                                    this._ensureSize(2), this.view.setUint16(this.ptr, a, this.littleEndien), this.ptr += 2;
                                },
                                I32: function(a) {
                                    this._ensureSize(4), this.view.setInt32(this.ptr, a, this.littleEndien), this.ptr += 4;
                                },
                                U32: function(a) {
                                    this._ensureSize(4), this.view.setUint32(this.ptr, a, this.littleEndien), this.ptr += 4;
                                },
                                F32: function(a) {
                                    this._ensureSize(4), this.view.setFloat32(this.ptr, a, this.littleEndien), this.ptr += 4;
                                },
                                F64: function(a) {
                                    this._ensureSize(8), this.view.setFloat64(this.ptr, a, this.littleEndien), this.ptr += 8;
                                },
                                writeBytes: function(a, b) {
                                    void 0 === b && (b = a.byteLength), this._ensureSize(b);
                                    var c = new Int8Array(this.buffer, this.ptr, b), d = new Int8Array(a, 0, b);
                                    c.set(d), this.ptr += b;
                                },
                                writeSub: function(a) {
                                    var b = a.byteLength;
                                    this._ensureSize(b);
                                    var c = new Int8Array(this.buffer, this.ptr, b);
                                    c.set(a), this.ptr += b;
                                },
                                writeUTF: function(a) {
                                    return this._ensureSize(4 * a.length + 2), this.U16(a.length), this.writeUTFBytes(a);
                                },
                                writeUTFBytes: function(a) {
                                    for (var c = 0, d = a.length; d > c; c++) {
                                        var e, f = a[c].codePointAt(0);
                                        if (128 > f ? e = 1 : 2048 > f ? e = 2 : 65536 > f ? e = 3 : 2097152 > f && (e = 4), 
                                        1 === e) this.U8(f); else for (this.U8((b[e] << 8 - e) + (f >>> 6 * --e)); e > 0; ) this.U8(f >>> 6 * --e & 63 | 128);
                                    }
                                }
                            }, module.exports = c;
                        }, {
                            "string.prototype.codepointat": 1
                        } ],
                        8: [ function(require, module, exports) {
                            !function() {
                                var a = function() {
                                    this.id = 0, this.ns = 0, this.type = 0, this.flags = 0, this.size = 0, this.data = null;
                                };
                                a.prototype = {
                                    read: function(a) {
                                        this.id = a.U32(), this.ns = a.U8(), this.type = a.U8(), this.flags = a.U8(), this.size = a.U32();
                                    },
                                    write: function(a) {
                                        a.U32(this.id), a.U8(this.ns), a.U8(this.type), a.U8(this.flags);
                                    }
                                }, module.exports = a;
                            }();
                        }, {} ],
                        9: [ function(require, module, exports) {
                            !function() {
                                var a = {
                                    UNCOMPRESSED: 0,
                                    DEFLATE: 1,
                                    LZMA: 2,
                                    AWD_FIELD_INT8: 1,
                                    AWD_FIELD_INT16: 2,
                                    AWD_FIELD_INT32: 3,
                                    AWD_FIELD_UINT8: 4,
                                    AWD_FIELD_UINT16: 5,
                                    AWD_FIELD_UINT32: 6,
                                    AWD_FIELD_FLOAT32: 7,
                                    AWD_FIELD_FLOAT64: 8,
                                    AWD_FIELD_BOOL: 21,
                                    AWD_FIELD_COLOR: 22,
                                    AWD_FIELD_BADDR: 23,
                                    AWD_FIELD_STRING: 31,
                                    AWD_FIELD_BYTEARRAY: 32,
                                    AWD_FIELD_VECTOR2x1: 41,
                                    AWD_FIELD_VECTOR3x1: 42,
                                    AWD_FIELD_VECTOR4x1: 43,
                                    AWD_FIELD_MTX3x2: 44,
                                    AWD_FIELD_MTX3x3: 45,
                                    AWD_FIELD_MTX4x3: 46,
                                    AWD_FIELD_MTX4x4: 47,
                                    INT8: 1,
                                    INT16: 2,
                                    INT32: 3,
                                    UINT8: 4,
                                    UINT16: 5,
                                    UINT32: 6,
                                    FLOAT32: 7,
                                    FLOAT64: 8,
                                    AWDSTRING: 31,
                                    AWDBYTEARRAY: 32,
                                    MAGIC: 4282180,
                                    GENERIC: 0,
                                    GEOMETRY: 1,
                                    PRIMITIVE: 11,
                                    CONTAINER: 22,
                                    MESH: 23,
                                    MATERIAL: 81,
                                    TEXTURE: 82,
                                    NAMESPACE: 254,
                                    METADATA: 255,
                                    MODEL_ENTITY: 2,
                                    MODEL_SKYBOX: 4,
                                    MODEL_CAMERA: 8,
                                    MODEL_SEGMENT_SET: 16,
                                    MODEL_MESH: 32,
                                    MODEL_GEOMETRY: 64,
                                    MODEL_SKELETON: 128,
                                    MODEL_SKELETON_POSE: 256,
                                    MODEL_CONTAINER: 512,
                                    MODEL_TEXTURE: 1024,
                                    MODEL_TEXTURE_PROJECTOR: 2048,
                                    MODEL_MATERIAL: 4096,
                                    MODEL_ANIMATION_SET: 8192,
                                    MODEL_ANIMATION_STATE: 16384,
                                    MODEL_ANIMATION_NODE: 32768,
                                    MODEL_ANIMATOR: 65536,
                                    MODEL_STATE_TRANSITION: 1 << 17,
                                    MODEL_LIGHT: 1 << 18,
                                    MODEL_LIGHT_PICKER: 1 << 19,
                                    MODEL_SHADOW_MAP_METHOD: 1 << 20,
                                    MODEL_EFFECTS_METHOD: 1 << 21,
                                    MODEL_GENERIC: -1,
                                    POSITION: 1,
                                    INDEX: 2,
                                    UVS: 3,
                                    NORMAL: 4,
                                    TANGENT: 5,
                                    JOIN_IDX: 6,
                                    JOIN_WGT: 7,
                                    SUVS: 8,
                                    COLOR: 11,
                                    DEFAULT_NS: 0
                                };
                                module.exports = a;
                            }();
                        }, {} ],
                        10: [ function(require, module, exports) {
                            var a = require("DefaultElement"), b = require("Namespace"), c = function(a) {
                                this.nsUri = a, this.structs = [], this.nsId = 0;
                            };
                            c.prototype = {
                                addStruct: function(a) {
                                    this.structs.push(a);
                                },
                                addStructs: function(a) {
                                    for (var b = 0, c = a.length; c > b; b++) this.addStruct(a[b]);
                                },
                                create: function(b) {
                                    for (var c, d = this.structs, e = 0, f = d.length; f > e; e++) if (c = d[e], c.TYPE === b) return new c();
                                    return new a();
                                },
                                createNamespace: function() {
                                    var a = new b();
                                    return a.uri = this.nsUri, a;
                                }
                            }, module.exports = c;
                        }, {
                            DefaultElement: 3,
                            Namespace: 4
                        } ],
                        11: [ function(require, module, exports) {
                            !function() {
                                var a = require("consts"), b = function() {
                                    this.size = 12, this.version = {
                                        major: 0,
                                        minor: 0
                                    }, this.streaming = !1, this.accuracyMatrix = !1, this.accuracyGeo = !1, this.accuracyProps = !1, 
                                    this.geoNrType = a.FLOAT32, this.matrixNrType = a.FLOAT32, this.propsNrType = a.FLOAT32, 
                                    this.optimized_for_accuracy = !1, this.compression = !1, this.bodylen = 0;
                                };
                                b.prototype = {
                                    read: function(b) {
                                        var c = b.U8() << 16 | b.U8() << 8 | b.U8();
                                        if (c !== a.MAGIC) throw new Error("AWD parse error - bad magic " + c.toString(16));
                                        var d = this.version;
                                        d.major = b.U8(), d.minor = b.U8();
                                        var e = b.U16();
                                        this.streaming = 1 === (1 & e), this.optimized_for_accuracy = 2 === (2 & e), 2 === d.major && 1 === d.minor && (this.accuracyMatrix = 2 === (2 & e), 
                                        this.accuracyGeo = 4 === (4 & e), this.accuracyProps = 8 === (8 & e)), this.geoNrType = this.accuracyGeo ? a.FLOAT64 : a.FLOAT32, 
                                        this.matrixNrType = this.accuracyMatrix ? a.FLOAT64 : a.FLOAT32, this.propsNrType = this.accuracyProps ? a.FLOAT64 : a.FLOAT32, 
                                        this.compression = b.U8(), this.bodylen = b.U32();
                                    },
                                    write: function(a) {
                                        a.U8(65), a.U8(87), a.U8(68), a.U8(this.version.major), a.U8(this.version.minor);
                                        var b = (this.streaming ? 1 : 0) | (this.accuracyMatrix ? 2 : 0) | (this.accuracyGeo ? 4 : 0) | (this.accuracyProps ? 8 : 0);
                                        a.U16(b), a.U8(this.compression), a.U32(this.bodylen);
                                    }
                                }, module.exports = b;
                            }();
                        }, {
                            consts: 9
                        } ],
                        12: [ function(require, module, exports) {
                            !function() {
                                var a = {}.hasOwnProperty, b = Object.defineProperty, c = function(b, c) {
                                    function d() {
                                        this.constructor = b;
                                    }
                                    for (var e in c) a.call(c, e) && (b[e] = c[e]);
                                    d.prototype = c.prototype, b.prototype = new d(), b.__super__ = c.prototype;
                                }, d = function(a, c, d, e) {
                                    b(a, c, {
                                        get: d,
                                        set: e
                                    });
                                };
                                return {
                                    extend: c,
                                    getset: d
                                };
                            }();
                        }, {} ],
                        13: [ function(require, module, exports) {
                            var a = require("consts");
                            module.exports = function(b) {
                                var c, d, e = b.getDatasByType(a.GEOMETRY);
                                for (c = 0, d = e.length; d > c; c++) {
                                    var f, g, h = e[c];
                                    for (f = 0, g = h.subGeoms.length; g > f; f++) {
                                        var i = h.subGeoms[f], j = i.getBuffersByType([ a.POSITION ])[0];
                                        if (3 !== j.components) throw new Error("invalid number of components, should be 3, is " + j.components);
                                        var k, l, m, n, o, p, q, r, s = j.data;
                                        for (m = p = s[0], n = q = s[1], o = r = s[2], k = 3, l = s.length; l > k; k += 3) m = Math.min(m, s[k]), 
                                        p = Math.max(p, s[k]), n = Math.min(n, s[k + 1]), q = Math.max(q, s[k + 1]), o = Math.min(o, s[k + 2]), 
                                        r = Math.max(r, s[k + 2]);
                                        var t = b.header.geoNrType, u = i.props;
                                        u.expected[10] = u.expected[11] = u.expected[12] = u.expected[13] = u.expected[14] = u.expected[15] = t, 
                                        u.set(10, m), u.set(11, n), u.set(12, o), u.set(13, p), u.set(14, q), u.set(15, r);
                                    }
                                }
                            };
                        }, {
                            consts: 9
                        } ],
                        14: [ function(require, module, exports) {
                            var a = require("consts");
                            module.exports = function(b) {
                                var c, d, e = b.getDatasByType(a.GEOMETRY);
                                for (c = 0, d = e.length; d > c; c++) {
                                    var f, g, h = e[c];
                                    for (f = 0, g = h.subGeoms.length; g > f; f++) {
                                        var i, j, k = h.subGeoms[f], l = k.getBuffersByType(a.INDEX);
                                        for (i = 0, j = l.length; j > i; i++) {
                                            var m, n, o, p = l[i], q = p.data;
                                            for (m = 1, n = q.length; n > m; m += 3) o = q[m], q[m] = q[m + 1], q[m + 1] = o;
                                        }
                                    }
                                }
                            };
                        }, {
                            consts: 9
                        } ],
                        15: [ function(require, module, exports) {
                            var a = require("consts");
                            module.exports = function(b) {
                                var c, d, e = b.getDatasByType(a.GEOMETRY);
                                for (c = 0, d = e.length; d > c; c++) {
                                    var f, g, h = e[c];
                                    for (f = 0, g = h.subGeoms.length; g > f; f++) {
                                        var i, j, k = h.subGeoms[f], l = k.getBuffersByType(a.UVS);
                                        for (i = 0, j = l.length; j > i; i++) {
                                            var m = l[i];
                                            if (2 !== m.components) throw new Error("invalid number of components, should be 3, is " + m.components);
                                            var n, o, p = m.data;
                                            for (n = 1, o = p.length; o > n; n += 2) p[n] = 1 - p[n];
                                        }
                                    }
                                }
                            };
                        }, {
                            consts: 9
                        } ],
                        16: [ function(require, module, exports) {
                            var a = require("consts");
                            module.exports = function(b) {
                                var c = b.getDatasByType(a.GEOMETRY);
                                console.log(c.length);
                                var d, e;
                                for (d = 0, e = c.length; e > d; d++) {
                                    var f, g, h = c[d];
                                    for (f = 0, g = h.subGeoms.length; g > f; f++) {
                                        var i, j, k = h.subGeoms[f], l = k.getBuffersByType([ a.POSITION, a.NORMAL, a.TANGENT ]);
                                        for (i = 0, j = l.length; j > i; i++) {
                                            var m = l[i];
                                            if (3 !== m.components) throw new Error("invalid number of components, should be 3, is " + m.components);
                                            var n, o, p = m.data;
                                            for (n = 0, o = p.length; o > n; n += 3) p[n] = -p[n];
                                        }
                                    }
                                }
                            };
                        }, {
                            consts: 9
                        } ],
                        17: [ function(require, module, exports) {
                            function a(a, b) {
                                var c, d;
                                for (c = 1, d = a.length; d > c; c++) a[c] = b[0] * a[c] + b[5];
                            }
                            function b(a, b) {
                                var c, d;
                                for (c = 1, d = a.length; d > c; c += 2) {
                                    var e = a[c], f = a[c + 1];
                                    a[c + 0] = b[0] * e + b[2] * f + b[5], a[c + 1] = b[6] * e + b[7] * f + b[10];
                                }
                            }
                            function c(a, b) {
                                var c, d;
                                for (c = 1, d = a.length; d > c; c += 3) {
                                    var e = a[c], f = a[c + 1], g = a[c + 2];
                                    a[c + 0] = b[0] * e + b[2] * f + b[3] * g + b[5], a[c + 1] = b[6] * e + b[7] * f + b[8] * g + b[10], 
                                    a[c + 2] = b[11] * e + b[12] * f + b[13] * g + b[15];
                                }
                            }
                            function d(a, b) {
                                var c, d;
                                for (c = 1, d = a.length; d > c; c += 4) {
                                    var e = a[c], f = a[c + 1], g = a[c + 2], h = a[c + 3];
                                    a[c + 0] = b[0] * e + b[2] * f + b[3] * g + b[4] * h + b[5], a[c + 1] = b[6] * e + b[7] * f + b[8] * g + b[9] * h + b[10], 
                                    a[c + 2] = b[11] * e + b[12] * f + b[13] * g + b[14] * h + b[15], a[c + 3] = b[16] * e + b[17] * f + b[18] * g + b[19] * h + b[20];
                                }
                            }
                            var e = require("consts"), f = [ null, a, b, c, d ];
                            module.exports = function(a, b, c) {
                                var d, g, h, i, j, k, l = a.getDatasByType(e.GEOMETRY);
                                for (d = 0, g = l.length; g > d; d++) {
                                    var m = l[d];
                                    for (h = 0, i = m.subGeoms.length; i > h; h++) {
                                        var n = m.subGeoms[h], o = n.getBuffersByType(c);
                                        for (j = 0, k = o.length; k > j; j++) {
                                            var p = o[j], q = p.components, r = p.data;
                                            if (1 > q || q > 4) throw new Error("invalid number of components, must be [1-4], is " + q);
                                            f[q](r, b);
                                        }
                                    }
                                }
                            };
                        }, {
                            consts: 9
                        } ],
                        18: [ function(require, module, exports) {
                            module.exports = {
                                read: function(a) {
                                    var b = a.U16();
                                    return a.readUTFBytes(b);
                                },
                                write: function(a, b) {
                                    b.U16(a.length), b.writeUTFBytes(a);
                                },
                                getUTFBytesLength: function(a) {
                                    for (var b = 0, c = 0, d = a.length; d > c; c++) {
                                        var e, f = a[c].codePointAt(0);
                                        128 > f ? e = 1 : 2048 > f ? e = 2 : 65536 > f ? e = 3 : 2097152 > f && (e = 4), 
                                        b += e;
                                    }
                                    return b;
                                }
                            };
                        }, {} ],
                        19: [ function(require, module, exports) {
                            !function() {
                                var a = function() {
                                    this.data = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
                                };
                                a.prototype = {
                                    read: function(a, b) {
                                        this.parseMatrix43RawData(a, b, this.data);
                                    },
                                    write: function(a, b) {
                                        this.writeMatrix43RawData(a, b, this.data);
                                    },
                                    parseMatrix43RawData: function(a, b, c) {
                                        var d = c, e = a.header.accuracyMatrix ? b.F64 : b.F32;
                                        return d[0] = e.call(b), d[1] = e.call(b), d[2] = e.call(b), d[3] = 0, d[4] = e.call(b), 
                                        d[5] = e.call(b), d[6] = e.call(b), d[7] = 0, d[8] = e.call(b), d[9] = e.call(b), 
                                        d[10] = e.call(b), d[11] = 0, d[12] = e.call(b), d[13] = e.call(b), d[14] = e.call(b), 
                                        d[15] = 1, isNaN(d[0]) && (d[0] = 1, d[1] = 0, d[2] = 0, d[4] = 0, d[5] = 1, d[6] = 0, 
                                        d[8] = 0, d[9] = 0, d[10] = 1, d[12] = 0, d[13] = 0, d[14] = 0), d;
                                    },
                                    writeMatrix43RawData: function(a, b, c) {
                                        var d = c, e = a.header.accuracyMatrix ? b.F64 : b.F32;
                                        e.call(b, d[0]), e.call(b, d[1]), e.call(b, d[2]), e.call(b, d[4]), e.call(b, d[5]), 
                                        e.call(b, d[6]), e.call(b, d[8]), e.call(b, d[9]), e.call(b, d[10]), e.call(b, d[12]), 
                                        e.call(b, d[13]), e.call(b, d[14]);
                                    }
                                }, module.exports = a;
                            }();
                        }, {} ],
                        20: [ function(require, module, exports) {
                            !function() {
                                var a = require("consts"), b = require("types/awdString"), c = require("bufferWriter"), d = require("bufferReader"), e = function(a) {
                                    this.expected = a, this.vars = {};
                                };
                                e.prototype = {
                                    clone: function() {
                                        var a = new c(64);
                                        this.write(a);
                                        var b = new e(this.expected);
                                        return b.read(new d(a.buffer)), b;
                                    },
                                    read: function(a) {
                                        var b = this.expected, c = a.U32(), d = a.ptr + c;
                                        if (b) for (;a.ptr < d; ) {
                                            var e, f = a.U16(), g = a.U32();
                                            this.expected.hasOwnProperty(f) ? (e = b[f], this.set(f, this.parseAttrValue(e, g, a))) : a.ptr += g;
                                        }
                                        a.ptr !== d && (console.log("Warn Properties don't read entire data ", a.ptr, d, c), 
                                        a.ptr = d);
                                    },
                                    write: function(a) {
                                        var b = a.skipBlockSize(), c = this.vars;
                                        for (var d in c) {
                                            var e = this.expected[d], f = c[d];
                                            a.U16(d), this.writeAttrValue(e, f, a);
                                        }
                                        a.writeBlockSize(b);
                                    },
                                    set: function(a, b) {
                                        this.vars[a] = b;
                                    },
                                    get: function(a, b) {
                                        return this.vars.hasOwnProperty(a) ? this.vars[a] : b;
                                    },
                                    writeAttrValue: function(c, d, e) {
                                        var f, g;
                                        switch (c) {
                                          case a.AWD_FIELD_INT8:
                                            f = 1, g = e.I8;
                                            break;

                                          case a.AWD_FIELD_INT16:
                                            f = 2, g = e.I16;
                                            break;

                                          case a.AWD_FIELD_INT32:
                                            f = 4, g = e.I32;
                                            break;

                                          case a.AWD_FIELD_BOOL:
                                          case a.AWD_FIELD_UINT8:
                                            f = 1, g = e.U8;
                                            break;

                                          case a.AWD_FIELD_UINT16:
                                            f = 2, g = e.U16;
                                            break;

                                          case a.AWD_FIELD_UINT32:
                                          case a.AWD_FIELD_BADDR:
                                            f = 4, g = e.U32;
                                            break;

                                          case a.AWD_FIELD_FLOAT32:
                                            f = 4, g = e.F32;
                                            break;

                                          case a.AWD_FIELD_FLOAT64:
                                            f = 8, g = e.F64;
                                            break;

                                          case a.AWD_FIELD_STRING:
                                            return e.U32(b.getUTFBytesLength(d)), void e.writeUTFBytes(d);

                                          case a.AWD_FIELD_VECTOR2x1:
                                          case a.AWD_FIELD_VECTOR3x1:
                                          case a.AWD_FIELD_VECTOR4x1:
                                          case a.AWD_FIELD_MTX3x2:
                                          case a.AWD_FIELD_MTX3x3:
                                          case a.AWD_FIELD_MTX4x3:
                                          case a.AWD_FIELD_MTX4x4:
                                            f = 8, g = e.F64;
                                        }
                                        if (d instanceof Array) {
                                            e.U32(d.length * f);
                                            for (var h = 0, i = d.length; i > h; h++) g.call(e, d[h]);
                                        } else e.U32(f), g.call(e, d);
                                    },
                                    parseAttrValue: function(b, c, d) {
                                        var e, f;
                                        switch (b) {
                                          case a.AWD_FIELD_INT8:
                                            e = 1, f = d.I8;
                                            break;

                                          case a.AWD_FIELD_INT16:
                                            e = 2, f = d.I16;
                                            break;

                                          case a.AWD_FIELD_INT32:
                                            e = 4, f = d.I32;
                                            break;

                                          case a.AWD_FIELD_BOOL:
                                          case a.AWD_FIELD_UINT8:
                                            e = 1, f = d.U8;
                                            break;

                                          case a.AWD_FIELD_UINT16:
                                            e = 2, f = d.U16;
                                            break;

                                          case a.AWD_FIELD_UINT32:
                                          case a.AWD_FIELD_BADDR:
                                            e = 4, f = d.U32;
                                            break;

                                          case a.AWD_FIELD_FLOAT32:
                                            e = 4, f = d.F32;
                                            break;

                                          case a.AWD_FIELD_FLOAT64:
                                            e = 8, f = d.F64;
                                            break;

                                          case a.AWD_FIELD_STRING:
                                            var g = d.U16();
                                            g === c && console.log("WARN may be Prefab bug / String property bug!!"), d.ptr -= 2;
                                            var h = d.readUTFBytes(c);
                                            return h;

                                          case a.AWD_FIELD_VECTOR2x1:
                                          case a.AWD_FIELD_VECTOR3x1:
                                          case a.AWD_FIELD_VECTOR4x1:
                                          case a.AWD_FIELD_MTX3x2:
                                          case a.AWD_FIELD_MTX3x3:
                                          case a.AWD_FIELD_MTX4x3:
                                          case a.AWD_FIELD_MTX4x4:
                                            e = 8, f = d.F64;
                                        }
                                        if (c > e) {
                                            var i, j, k;
                                            for (i = [], j = 0, k = c / e; k > j; ) i.push(f.call(d)), j++;
                                            return i;
                                        }
                                        return f.call(d);
                                    }
                                }, module.exports = e;
                            }();
                        }, {
                            bufferReader: 6,
                            bufferWriter: 7,
                            consts: 9,
                            "types/awdString": 18
                        } ],
                        21: [ function(require, module, exports) {
                            !function() {
                                var a = require("consts"), b = require("types/awdString"), c = require("bufferWriter"), d = require("bufferReader"), e = function() {
                                    this.attributes = {}, this._list = [];
                                };
                                e.prototype = {
                                    clone: function() {
                                        var a = new c(64);
                                        this.write(a);
                                        var b = new e();
                                        return b.read(new d(a.buffer)), b;
                                    },
                                    addAttribute: function(a, b, c, d) {
                                        var e = {
                                            name: a,
                                            value: b,
                                            type: c,
                                            ns: d
                                        };
                                        this.attributes[a] = e, this._list.push(e);
                                    },
                                    read: function(c) {
                                        var d, e = c.U32();
                                        if (e > 0) {
                                            d = {};
                                            for (var f = c.ptr + e; c.ptr < f; ) {
                                                var g, h = c.U8(), i = b.read(c), j = c.U8(), k = c.U32();
                                                switch (j) {
                                                  case a.AWDSTRING:
                                                    g = c.readUTFBytes(k);
                                                    break;

                                                  case a.INT8:
                                                    g = c.I8();
                                                    break;

                                                  case a.INT16:
                                                    g = c.I16();
                                                    break;

                                                  case a.INT32:
                                                    g = c.I32();
                                                    break;

                                                  case a.BOOL:
                                                  case a.UINT8:
                                                    g = c.U8();
                                                    break;

                                                  case a.UINT16:
                                                    g = c.U16();
                                                    break;

                                                  case a.UINT32:
                                                  case a.BADDR:
                                                    g = c.U32();
                                                    break;

                                                  case a.FLOAT32:
                                                    g = c.F32();
                                                    break;

                                                  case a.FLOAT64:
                                                    g = c.F64();
                                                    break;

                                                  default:
                                                    g = "unimplemented attribute type " + j + "ns : " + h, c.ptr += k;
                                                }
                                                this.addAttribute(i, g, j, h), d[i] = g;
                                            }
                                        }
                                        return d;
                                    },
                                    write: function(c) {
                                        for (var d = c.skipBlockSize(), e = 0, f = this._list.length; f > e; e++) {
                                            var g, h = this._list[e], i = h.ns, j = h.name, k = h.type, l = h.value;
                                            switch (c.U8(i), b.write(j, c), c.U8(k), k) {
                                              case a.AWDSTRING:
                                                g = b.getUTFBytesLength(l), c.U32(g), c.writeUTFBytes(l);
                                                break;

                                              case a.INT8:
                                                c.U32(1), c.I8(l);
                                                break;

                                              case a.INT16:
                                                c.U32(2), c.I16(l);
                                                break;

                                              case a.INT32:
                                                c.U32(4), c.I32(l);
                                                break;

                                              case a.BOOL:
                                              case a.UINT8:
                                                c.U32(1), c.U8(l);
                                                break;

                                              case a.UINT16:
                                                c.U32(2), c.U16(l);
                                                break;

                                              case a.UINT32:
                                              case a.BADDR:
                                                c.U32(4), c.U32(l);
                                                break;

                                              case a.FLOAT32:
                                                c.U32(4), c.F32(l);
                                                break;

                                              case a.FLOAT64:
                                                c.U32(8), c.F64(l);
                                                break;

                                              default:
                                                throw new Error("UserAttribute unsupported type");
                                            }
                                        }
                                        c.writeBlockSize(d);
                                    }
                                }, module.exports = e;
                            }();
                        }, {
                            bufferReader: 6,
                            bufferWriter: 7,
                            consts: 9,
                            "types/awdString": 18
                        } ],
                        22: [ function(require, module, exports) {
                            !function() {
                                var a = require("consts"), b = require("types/properties"), c = function(a, b, c) {
                                    this.x = a || 0, this.y = b || 0, this.z = c || 0;
                                };
                                c.prototype = {
                                    parsePivot: function(c, d) {
                                        var e = c.header.matrixNrType, f = new b({
                                            1: e,
                                            2: e,
                                            3: e,
                                            4: a.UINT8
                                        });
                                        f.read(d), this.x = f.get(1, 0), this.y = f.get(2, 0), this.z = f.get(3, 0);
                                    },
                                    writePivot: function(c, d) {
                                        var e = c.header.matrixNrType, f = new b({
                                            1: e,
                                            2: e,
                                            3: e,
                                            4: a.UINT8
                                        });
                                        f.set(1, this.x), f.set(2, this.y), f.set(3, this.z), f.write(d);
                                    }
                                }, module.exports = c;
                            }();
                        }, {
                            consts: 9,
                            "types/properties": 20
                        } ],
                        23: [ function(require, module, exports) {
                            !function() {
                                var a = require("bufferWriter"), b = 262144, c = {
                                    write: function(c) {
                                        var d = new a(b);
                                        d.ptr = c.header.size;
                                        for (var e, f = c._elements, g = [], h = 0, i = f.length; i > h; h++) e = f[h], 
                                        e.prepareAndAdd(c, g);
                                        var j;
                                        for (h = 0, i = g.length; i > h; h++) -1 !== f.indexOf(g[h]) && (g[h].chunk.write(d), 
                                        j = d.skipBlockSize(), g[h].write(d), d.writeBlockSize(j));
                                        var k = d.ptr;
                                        return d.ptr = 0, c.header.bodylen = k - c.header.size, c.header.write(d), d.ptr = k, 
                                        d.copy();
                                    }
                                };
                                module.exports = c;
                            }();
                        }, {
                            bufferWriter: 7
                        } ],
                        libawd: [ function(require, module, exports) {
                            var a = require("BaseElement"), b = require("DefaultElement"), c = require("Namespace"), d = require("awd"), e = require("bufferReader"), f = require("bufferWriter"), g = require("chunk"), h = require("consts"), i = require("extension"), j = require("header"), k = require("lang"), l = require("tools/computeBounds"), m = require("tools/flipFaces"), n = require("tools/flipUvsY"), o = require("tools/flipX"), p = require("tools/transform"), q = require("types/awdString"), r = require("types/matrix"), s = require("types/properties"), t = require("types/userAttr"), u = require("types/vec3"), v = require("writer"), w = {
                                BaseElement: a,
                                DefaultElement: b,
                                Namespace: c,
                                awd: d,
                                bufferReader: e,
                                bufferWriter: f,
                                chunk: g,
                                consts: h,
                                extension: i,
                                header: j,
                                lang: k,
                                computeBounds: l,
                                flipFaces: m,
                                flipUvsY: n,
                                flipX: o,
                                transform: p,
                                awdString: q,
                                matrix: r,
                                properties: s,
                                userAttr: t,
                                vec3: u,
                                writer: v
                            };
                            module.exports = w;
                        }, {
                            BaseElement: 2,
                            DefaultElement: 3,
                            Namespace: 4,
                            awd: 5,
                            bufferReader: 6,
                            bufferWriter: 7,
                            chunk: 8,
                            consts: 9,
                            extension: 10,
                            header: 11,
                            lang: 12,
                            "tools/computeBounds": 13,
                            "tools/flipFaces": 14,
                            "tools/flipUvsY": 15,
                            "tools/flipX": 16,
                            "tools/transform": 17,
                            "types/awdString": 18,
                            "types/matrix": 19,
                            "types/properties": 20,
                            "types/userAttr": 21,
                            "types/vec3": 22,
                            writer: 23
                        } ]
                    }, {}, [])("libawd");
                });
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            BaseElement: 7,
            DefaultElement: 8,
            Namespace: 9,
            awd: 10,
            bufferReader: 11,
            bufferWriter: 12,
            chunk: 13,
            consts: 14,
            extension: 15,
            header: 16,
            lang: 17,
            "string.prototype.codepointat": 6,
            "tools/computeBounds": 18,
            "tools/flipFaces": 19,
            "tools/flipUvsY": 20,
            "tools/flipX": 21,
            "tools/transform": 22,
            "types/awdString": 23,
            "types/matrix": 24,
            "types/properties": 25,
            "types/userAttr": 26,
            "types/vec3": 27,
            writer: 28
        } ],
        6: [ function(require, module, exports) {
            String.prototype.codePointAt || !function() {
                "use strict";
                var a = function() {
                    try {
                        var a = {}, b = Object.defineProperty, c = b(a, a, a) && b;
                    } catch (d) {}
                    return c;
                }(), b = function(a) {
                    if (null == this) throw TypeError();
                    var b = String(this), c = b.length, d = a ? Number(a) : 0;
                    if (d != d && (d = 0), 0 > d || d >= c) return void 0;
                    var e, f = b.charCodeAt(d);
                    return f >= 55296 && 56319 >= f && c > d + 1 && (e = b.charCodeAt(d + 1), e >= 56320 && 57343 >= e) ? 1024 * (f - 55296) + e - 56320 + 65536 : f;
                };
                a ? a(String.prototype, "codePointAt", {
                    value: b,
                    configurable: !0,
                    writable: !0
                }) : String.prototype.codePointAt = b;
            }();
        }, {} ],
        7: [ function(require, module, exports) {
            !function() {
                var a = require("consts"), b = require("chunk"), c = {
                    _setup: function(a, b) {
                        this.awd = a, this.chunk = b, this.id = b.id;
                    },
                    init: function() {
                        this.injectDeps = !1, this.model = a.MODEL_GENERIC;
                    },
                    getDependencies: function() {
                        return this.deps ? this.deps : null;
                    },
                    prepareAndAdd: void 0,
                    prepareChunk: function() {
                        null === this.chunk && (this.chunk = new b()), this.chunk.type = this.type, this.chunk.ns = this.ns;
                    }
                }, d = {};
                d.createStruct = function(a, b, d) {
                    var e = function() {
                        this.type = a, this.nsUri = b, this.ns = 0, this.injectDeps = !0, this.init(), this.chunk = null, 
                        this.id = -1;
                    };
                    e.TYPE = a;
                    var f;
                    for (f in c) e.prototype[f] = c[f];
                    for (f in d) e.prototype[f] = d[f];
                    return e;
                }, module.exports = d;
            }();
        }, {
            chunk: 13,
            consts: 14
        } ],
        8: [ function(require, module, exports) {
            var a = require("consts"), b = require("BaseElement"), c = b.createStruct(a.GENERIC, -1, {
                read: function(a) {
                    this.buf = new ArrayBuffer(this.chunk.size), a.readBytes(this.buf, this.chunk.size), 
                    this.setDeps();
                },
                write: function(a) {
                    a.writeBytes(this.buf, this.chunk.size);
                },
                setDeps: function() {
                    for (var a, b = this.awd._elements, c = [], d = 0, e = b.length; e > d; d++) a = b[d], 
                    c.push(a);
                    this.deps = c;
                },
                prepareAndAdd: void 0,
                prepareChunk: function() {}
            });
            module.exports = c;
        }, {
            BaseElement: 7,
            consts: 14
        } ],
        9: [ function(require, module, exports) {
            !function() {
                var a = require("types/awdString"), b = require("consts"), c = require("BaseElement"), d = c.createStruct(b.NAMESPACE, null, {
                    init: function() {
                        this.uri = "", this.nsId = 0;
                    },
                    read: function(b) {
                        this.nsId = b.U8(), this.uri = a.read(b);
                    },
                    write: void 0
                });
                module.exports = d;
            }();
        }, {
            BaseElement: 7,
            consts: 14,
            "types/awdString": 23
        } ],
        10: [ function(require, module, exports) {
            var a = require("header"), b = require("writer"), c = require("consts"), d = require("chunk"), e = require("bufferReader"), f = require("DefaultElement"), g = function() {
                this.header = new a(), this._elements = [], this._elementsById = [], this._extensions = [];
            };
            g.prototype = {
                addElement: function(a) {
                    this._elements.push(a), this._elementsById[a.id] = a;
                },
                removeElement: function(a) {
                    var b = this._elements.indexOf(a);
                    b > -1 && this._elements.splice(b, 1);
                },
                parse: function(a) {
                    var b, c = new e(a);
                    for (this.header.read(c); c.bytesAvailable() > 0; ) b = this.parseChunk(c);
                },
                write: function() {
                    return b.write(this);
                },
                registerNamespace: function(a) {
                    var b = this.getExtension(a.uri);
                    b && (b.nsId = a.nsId);
                },
                addExtension: function(a) {
                    if (null === this.getExtension(a.nsUri)) {
                        var b, c = this._extensions.push(a), d = a.createNamespace();
                        null !== a.nsUri ? (b = c + 1, this.addElement(d)) : b = 0, d.nsId = a.nsId = b;
                    }
                },
                getExtension: function(a) {
                    for (var b = this._extensions, c = 0, d = b.length; d > c; c++) if (b[c].nsUri === a) return b[c];
                    return null;
                },
                getExtensionById: function(a) {
                    for (var b = this._extensions, c = 0, d = b.length; d > c; c++) if (b[c].nsId === a) return b[c];
                    return null;
                },
                getDatasByType: function(a, b, c) {
                    void 0 === b && (b = null), void 0 === c && (c = []);
                    var d, e;
                    if (a instanceof Array) for (d = 0, e = a.length; e > d; d++) this.getDatasByType(a[d], b, c); else for (d = 0, 
                    e = this._elements.length; e > d; d++) this._elements[d].type === a && this._elements[d].nsUri === b && c.push(this._elements[d]);
                    return c;
                },
                getAssetByID: function(a, b) {
                    var d = [], e = 0, f = this._elementsById;
                    if (a > 0 && f[a]) for (;e < b.length; ) {
                        if (0 !== (f[a].model & b[e])) return d.push(!0), d.push(f[a]), d;
                        if (b[e] === c.MODEL_GEOMETRY && 0 !== (f[a].model & c.MODEL_MESH)) return d.push(!0), 
                        d.push(f[a].geometry), d;
                        e++;
                    }
                    return d.push(!1), d.push(null), d;
                },
                parseChunk: function(a) {
                    var b = new d();
                    b.read(a);
                    var e = this.structFactory(b), f = a.ptr;
                    e.read(a), a.ptr - f !== b.size && (console.log("Warn bad block parsing , byte delta : ", a.ptr - f - b.size), 
                    a.ptr = f + b.size), b.ns === c.DEFAULT_NS && b.type === c.NAMESPACE && this.registerNamespace(e), 
                    this.addElement(e);
                },
                structFactory: function(a) {
                    var b, c = this.getExtensionById(a.ns);
                    return b = c ? c.create(a.type) : new f(), b._setup(this, a), b;
                },
                resolveNamespace: function(a) {
                    if (null == a.nsUri) return 0;
                    var b = this.getExtension(a.nsUri);
                    return b ? b.nsId : (console.log("Missing extension " + a.nsUri), 0);
                }
            }, module.exports = g;
        }, {
            DefaultElement: 8,
            bufferReader: 11,
            chunk: 13,
            consts: 14,
            header: 16,
            writer: 28
        } ],
        11: [ function(require, module, exports) {
            !function() {
                var a = function(a, b, c) {
                    this.buffer = a, this.ptr = 0, this.littleEndien = !0, b = b || 0, c = c || a.byteLength, 
                    this.view = new DataView(a, b, c), this.length = this.view.byteLength;
                };
                a.prototype = {
                    setPosition: function(a) {
                        this.ptr = a;
                    },
                    setLittleEndian: function(a) {
                        this.littleEndien = a;
                    },
                    bytesAvailable: function() {
                        return this.length - this.ptr;
                    },
                    I8: function() {
                        return this.view.getInt8(this.ptr++);
                    },
                    U8: function() {
                        return this.view.getUint8(this.ptr++);
                    },
                    I16: function() {
                        var a = this.view.getInt16(this.ptr, this.littleEndien);
                        return this.ptr += 2, a;
                    },
                    U16: function() {
                        var a = this.view.getUint16(this.ptr, this.littleEndien);
                        return this.ptr += 2, a;
                    },
                    I32: function() {
                        var a = this.view.getInt32(this.ptr, this.littleEndien);
                        return this.ptr += 4, a;
                    },
                    U32: function() {
                        var a = this.view.getUint32(this.ptr, this.littleEndien);
                        return this.ptr += 4, a;
                    },
                    F32: function() {
                        var a = this.view.getFloat32(this.ptr, this.littleEndien);
                        return this.ptr += 4, a;
                    },
                    F64: function() {
                        var a = this.view.getFloat64(this.ptr, this.littleEndien);
                        return this.ptr += 8, a;
                    },
                    readBytes: function(a, b) {
                        void 0 === b && (b = a.byteLength);
                        var c = new Int8Array(a), d = new Int8Array(this.buffer, this.ptr, b);
                        c.set(d), this.ptr += b;
                    },
                    subArray: function(a) {
                        var b = new Int8Array(this.buffer, this.ptr, a);
                        return this.ptr += a, b;
                    },
                    readUTFBytes: function(a) {
                        for (var b, c, d, e = this.ptr + a, f = [], g = 0; this.ptr < e; ) b = this.U8(), 
                        128 > b ? f[g++] = String.fromCharCode(b) : b > 191 && 224 > b ? (c = this.U8(), 
                        f[g++] = String.fromCharCode((31 & b) << 6 | 63 & c)) : (c = this.U8(), d = this.U8(), 
                        f[g++] = String.fromCharCode((15 & b) << 12 | (63 & c) << 6 | 63 & d));
                        return f.join("");
                    }
                }, module.exports = a;
            }();
        }, {} ],
        12: [ function(require, module, exports) {
            module.exports = {};
        }, {
            "string.prototype.codepointat": 6
        } ],
        13: [ function(require, module, exports) {
            !function() {
                var a = function() {
                    this.id = 0, this.ns = 0, this.type = 0, this.flags = 0, this.size = 0, this.data = null;
                };
                a.prototype = {
                    read: function(a) {
                        this.id = a.U32(), this.ns = a.U8(), this.type = a.U8(), this.flags = a.U8(), this.size = a.U32();
                    },
                    write: void 0
                }, module.exports = a;
            }();
        }, {} ],
        14: [ function(require, module, exports) {
            !function() {
                var a = {
                    UNCOMPRESSED: 0,
                    DEFLATE: 1,
                    LZMA: 2,
                    AWD_FIELD_INT8: 1,
                    AWD_FIELD_INT16: 2,
                    AWD_FIELD_INT32: 3,
                    AWD_FIELD_UINT8: 4,
                    AWD_FIELD_UINT16: 5,
                    AWD_FIELD_UINT32: 6,
                    AWD_FIELD_FLOAT32: 7,
                    AWD_FIELD_FLOAT64: 8,
                    AWD_FIELD_BOOL: 21,
                    AWD_FIELD_COLOR: 22,
                    AWD_FIELD_BADDR: 23,
                    AWD_FIELD_STRING: 31,
                    AWD_FIELD_BYTEARRAY: 32,
                    AWD_FIELD_VECTOR2x1: 41,
                    AWD_FIELD_VECTOR3x1: 42,
                    AWD_FIELD_VECTOR4x1: 43,
                    AWD_FIELD_MTX3x2: 44,
                    AWD_FIELD_MTX3x3: 45,
                    AWD_FIELD_MTX4x3: 46,
                    AWD_FIELD_MTX4x4: 47,
                    INT8: 1,
                    INT16: 2,
                    INT32: 3,
                    UINT8: 4,
                    UINT16: 5,
                    UINT32: 6,
                    FLOAT32: 7,
                    FLOAT64: 8,
                    AWDSTRING: 31,
                    AWDBYTEARRAY: 32,
                    MAGIC: 4282180,
                    GENERIC: 0,
                    GEOMETRY: 1,
                    PRIMITIVE: 11,
                    CONTAINER: 22,
                    MESH: 23,
                    MATERIAL: 81,
                    TEXTURE: 82,
                    NAMESPACE: 254,
                    METADATA: 255,
                    MODEL_ENTITY: 2,
                    MODEL_SKYBOX: 4,
                    MODEL_CAMERA: 8,
                    MODEL_SEGMENT_SET: 16,
                    MODEL_MESH: 32,
                    MODEL_GEOMETRY: 64,
                    MODEL_SKELETON: 128,
                    MODEL_SKELETON_POSE: 256,
                    MODEL_CONTAINER: 512,
                    MODEL_TEXTURE: 1024,
                    MODEL_TEXTURE_PROJECTOR: 2048,
                    MODEL_MATERIAL: 4096,
                    MODEL_ANIMATION_SET: 8192,
                    MODEL_ANIMATION_STATE: 16384,
                    MODEL_ANIMATION_NODE: 32768,
                    MODEL_ANIMATOR: 65536,
                    MODEL_STATE_TRANSITION: 1 << 17,
                    MODEL_LIGHT: 1 << 18,
                    MODEL_LIGHT_PICKER: 1 << 19,
                    MODEL_SHADOW_MAP_METHOD: 1 << 20,
                    MODEL_EFFECTS_METHOD: 1 << 21,
                    MODEL_GENERIC: -1,
                    POSITION: 1,
                    INDEX: 2,
                    UVS: 3,
                    NORMAL: 4,
                    TANGENT: 5,
                    JOIN_IDX: 6,
                    JOIN_WGT: 7,
                    SUVS: 8,
                    COLOR: 11,
                    DEFAULT_NS: 0
                };
                module.exports = a;
            }();
        }, {} ],
        15: [ function(require, module, exports) {
            var a = require("DefaultElement"), b = require("Namespace"), c = function(a) {
                this.nsUri = a, this.structs = [], this.nsId = 0;
            };
            c.prototype = {
                addStruct: function(a) {
                    this.structs.push(a);
                },
                addStructs: function(a) {
                    for (var b = 0, c = a.length; c > b; b++) this.addStruct(a[b]);
                },
                create: function(b) {
                    for (var c, d = this.structs, e = 0, f = d.length; f > e; e++) if (c = d[e], c.TYPE === b) return new c();
                    return new a();
                },
                createNamespace: function() {
                    var a = new b();
                    return a.uri = this.nsUri, a;
                }
            }, module.exports = c;
        }, {
            DefaultElement: 8,
            Namespace: 9
        } ],
        16: [ function(require, module, exports) {
            !function() {
                var a = require("consts"), b = function() {
                    this.size = 12, this.version = {
                        major: 0,
                        minor: 0
                    }, this.streaming = !1, this.accuracyMatrix = !1, this.accuracyGeo = !1, this.accuracyProps = !1, 
                    this.geoNrType = a.FLOAT32, this.matrixNrType = a.FLOAT32, this.propsNrType = a.FLOAT32, 
                    this.optimized_for_accuracy = !1, this.compression = !1, this.bodylen = 0;
                };
                b.prototype = {
                    read: function(b) {
                        var c = b.U8() << 16 | b.U8() << 8 | b.U8();
                        if (c !== a.MAGIC) throw new Error("AWD parse error - bad magic " + c.toString(16));
                        var d = this.version;
                        d.major = b.U8(), d.minor = b.U8();
                        var e = b.U16();
                        this.streaming = 1 === (1 & e), this.optimized_for_accuracy = 2 === (2 & e), 2 === d.major && 1 === d.minor && (this.accuracyMatrix = 2 === (2 & e), 
                        this.accuracyGeo = 4 === (4 & e), this.accuracyProps = 8 === (8 & e)), this.geoNrType = this.accuracyGeo ? a.FLOAT64 : a.FLOAT32, 
                        this.matrixNrType = this.accuracyMatrix ? a.FLOAT64 : a.FLOAT32, this.propsNrType = this.accuracyProps ? a.FLOAT64 : a.FLOAT32, 
                        this.compression = b.U8(), this.bodylen = b.U32();
                    },
                    write: void 0
                }, module.exports = b;
            }();
        }, {
            consts: 14
        } ],
        17: [ function(require, module, exports) {
            !function() {
                var a = {}.hasOwnProperty, b = Object.defineProperty, c = function(b, c) {
                    function d() {
                        this.constructor = b;
                    }
                    for (var e in c) a.call(c, e) && (b[e] = c[e]);
                    d.prototype = c.prototype, b.prototype = new d(), b.__super__ = c.prototype;
                }, d = function(a, c, d, e) {
                    b(a, c, {
                        get: d,
                        set: e
                    });
                };
                return {
                    extend: c,
                    getset: d
                };
            }();
        }, {} ],
        18: [ function(require, module, exports) {
            var a = require("consts");
            module.exports = function(b) {
                var c, d, e = b.getDatasByType(a.GEOMETRY);
                for (c = 0, d = e.length; d > c; c++) {
                    var f, g, h = e[c];
                    for (f = 0, g = h.subGeoms.length; g > f; f++) {
                        var i = h.subGeoms[f], j = i.getBuffersByType([ a.POSITION ])[0];
                        if (3 !== j.components) throw new Error("invalid number of components, should be 3, is " + j.components);
                        var k, l, m, n, o, p, q, r, s = j.data;
                        for (m = p = s[0], n = q = s[1], o = r = s[2], k = 3, l = s.length; l > k; k += 3) m = Math.min(m, s[k]), 
                        p = Math.max(p, s[k]), n = Math.min(n, s[k + 1]), q = Math.max(q, s[k + 1]), o = Math.min(o, s[k + 2]), 
                        r = Math.max(r, s[k + 2]);
                        var t = b.header.geoNrType, u = i.props;
                        u.expected[10] = u.expected[11] = u.expected[12] = u.expected[13] = u.expected[14] = u.expected[15] = t, 
                        u.set(10, m), u.set(11, n), u.set(12, o), u.set(13, p), u.set(14, q), u.set(15, r);
                    }
                }
            };
        }, {
            consts: 14
        } ],
        19: [ function(require, module, exports) {
            var a = require("consts");
            module.exports = function(b) {
                var c, d, e = b.getDatasByType(a.GEOMETRY);
                for (c = 0, d = e.length; d > c; c++) {
                    var f, g, h = e[c];
                    for (f = 0, g = h.subGeoms.length; g > f; f++) {
                        var i, j, k = h.subGeoms[f], l = k.getBuffersByType(a.INDEX);
                        for (i = 0, j = l.length; j > i; i++) {
                            var m, n, o, p = l[i], q = p.data;
                            for (m = 1, n = q.length; n > m; m += 3) o = q[m], q[m] = q[m + 1], q[m + 1] = o;
                        }
                    }
                }
            };
        }, {
            consts: 14
        } ],
        20: [ function(require, module, exports) {
            var a = require("consts");
            module.exports = function(b) {
                var c, d, e = b.getDatasByType(a.GEOMETRY);
                for (c = 0, d = e.length; d > c; c++) {
                    var f, g, h = e[c];
                    for (f = 0, g = h.subGeoms.length; g > f; f++) {
                        var i, j, k = h.subGeoms[f], l = k.getBuffersByType(a.UVS);
                        for (i = 0, j = l.length; j > i; i++) {
                            var m = l[i];
                            if (2 !== m.components) throw new Error("invalid number of components, should be 3, is " + m.components);
                            var n, o, p = m.data;
                            for (n = 1, o = p.length; o > n; n += 2) p[n] = 1 - p[n];
                        }
                    }
                }
            };
        }, {
            consts: 14
        } ],
        21: [ function(require, module, exports) {
            var a = require("consts");
            module.exports = function(b) {
                var c = b.getDatasByType(a.GEOMETRY);
                console.log(c.length);
                var d, e;
                for (d = 0, e = c.length; e > d; d++) {
                    var f, g, h = c[d];
                    for (f = 0, g = h.subGeoms.length; g > f; f++) {
                        var i, j, k = h.subGeoms[f], l = k.getBuffersByType([ a.POSITION, a.NORMAL, a.TANGENT ]);
                        for (i = 0, j = l.length; j > i; i++) {
                            var m = l[i];
                            if (3 !== m.components) throw new Error("invalid number of components, should be 3, is " + m.components);
                            var n, o, p = m.data;
                            for (n = 0, o = p.length; o > n; n += 3) p[n] = -p[n];
                        }
                    }
                }
            };
        }, {
            consts: 14
        } ],
        22: [ function(require, module, exports) {
            function a(a, b) {
                var c, d;
                for (c = 1, d = a.length; d > c; c++) a[c] = b[0] * a[c] + b[5];
            }
            function b(a, b) {
                var c, d;
                for (c = 1, d = a.length; d > c; c += 2) {
                    var e = a[c], f = a[c + 1];
                    a[c + 0] = b[0] * e + b[2] * f + b[5], a[c + 1] = b[6] * e + b[7] * f + b[10];
                }
            }
            function c(a, b) {
                var c, d;
                for (c = 1, d = a.length; d > c; c += 3) {
                    var e = a[c], f = a[c + 1], g = a[c + 2];
                    a[c + 0] = b[0] * e + b[2] * f + b[3] * g + b[5], a[c + 1] = b[6] * e + b[7] * f + b[8] * g + b[10], 
                    a[c + 2] = b[11] * e + b[12] * f + b[13] * g + b[15];
                }
            }
            function d(a, b) {
                var c, d;
                for (c = 1, d = a.length; d > c; c += 4) {
                    var e = a[c], f = a[c + 1], g = a[c + 2], h = a[c + 3];
                    a[c + 0] = b[0] * e + b[2] * f + b[3] * g + b[4] * h + b[5], a[c + 1] = b[6] * e + b[7] * f + b[8] * g + b[9] * h + b[10], 
                    a[c + 2] = b[11] * e + b[12] * f + b[13] * g + b[14] * h + b[15], a[c + 3] = b[16] * e + b[17] * f + b[18] * g + b[19] * h + b[20];
                }
            }
            var e = require("consts"), f = [ null, a, b, c, d ];
            module.exports = function(a, b, c) {
                var d, g, h, i, j, k, l = a.getDatasByType(e.GEOMETRY);
                for (d = 0, g = l.length; g > d; d++) {
                    var m = l[d];
                    for (h = 0, i = m.subGeoms.length; i > h; h++) {
                        var n = m.subGeoms[h], o = n.getBuffersByType(c);
                        for (j = 0, k = o.length; k > j; j++) {
                            var p = o[j], q = p.components, r = p.data;
                            if (1 > q || q > 4) throw new Error("invalid number of components, must be [1-4], is " + q);
                            f[q](r, b);
                        }
                    }
                }
            };
        }, {
            consts: 14
        } ],
        23: [ function(require, module, exports) {
            module.exports = {
                read: function(a) {
                    var b = a.U16();
                    return a.readUTFBytes(b);
                },
                write: function(a, b) {
                    b.U16(a.length), b.writeUTFBytes(a);
                },
                getUTFBytesLength: function(a) {
                    for (var b = 0, c = 0, d = a.length; d > c; c++) {
                        var e, f = a[c].codePointAt(0);
                        128 > f ? e = 1 : 2048 > f ? e = 2 : 65536 > f ? e = 3 : 2097152 > f && (e = 4), 
                        b += e;
                    }
                    return b;
                }
            };
        }, {} ],
        24: [ function(require, module, exports) {
            !function() {
                var a = function() {
                    this.data = [ 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
                };
                a.prototype = {
                    read: function(a, b) {
                        this.parseMatrix43RawData(a, b, this.data);
                    },
                    write: void 0,
                    parseMatrix43RawData: function(a, b, c) {
                        var d = c, e = a.header.accuracyMatrix ? b.F64 : b.F32;
                        return d[0] = e.call(b), d[1] = e.call(b), d[2] = e.call(b), d[3] = 0, d[4] = e.call(b), 
                        d[5] = e.call(b), d[6] = e.call(b), d[7] = 0, d[8] = e.call(b), d[9] = e.call(b), 
                        d[10] = e.call(b), d[11] = 0, d[12] = e.call(b), d[13] = e.call(b), d[14] = e.call(b), 
                        d[15] = 1, isNaN(d[0]) && (d[0] = 1, d[1] = 0, d[2] = 0, d[4] = 0, d[5] = 1, d[6] = 0, 
                        d[8] = 0, d[9] = 0, d[10] = 1, d[12] = 0, d[13] = 0, d[14] = 0), d;
                    },
                    writeMatrix43RawData: void 0
                }, module.exports = a;
            }();
        }, {} ],
        25: [ function(require, module, exports) {
            !function() {
                var a = require("consts"), b = (require("types/awdString"), require("bufferWriter")), c = require("bufferReader"), d = function(a) {
                    this.expected = a, this.vars = {};
                };
                d.prototype = {
                    clone: function() {
                        var a = new b(64);
                        this.write(a);
                        var e = new d(this.expected);
                        return e.read(new c(a.buffer)), e;
                    },
                    read: function(a) {
                        var b = this.expected, c = a.U32(), d = a.ptr + c;
                        if (b) for (;a.ptr < d; ) {
                            var e, f = a.U16(), g = a.U32();
                            this.expected.hasOwnProperty(f) ? (e = b[f], this.set(f, this.parseAttrValue(e, g, a))) : a.ptr += g;
                        }
                        a.ptr !== d && (console.log("Warn Properties don't read entire data ", a.ptr, d, c), 
                        a.ptr = d);
                    },
                    write: void 0,
                    set: function(a, b) {
                        this.vars[a] = b;
                    },
                    get: function(a, b) {
                        return this.vars.hasOwnProperty(a) ? this.vars[a] : b;
                    },
                    writeAttrValue: void 0,
                    parseAttrValue: function(b, c, d) {
                        var e, f;
                        switch (b) {
                          case a.AWD_FIELD_INT8:
                            e = 1, f = d.I8;
                            break;

                          case a.AWD_FIELD_INT16:
                            e = 2, f = d.I16;
                            break;

                          case a.AWD_FIELD_INT32:
                            e = 4, f = d.I32;
                            break;

                          case a.AWD_FIELD_BOOL:
                          case a.AWD_FIELD_UINT8:
                            e = 1, f = d.U8;
                            break;

                          case a.AWD_FIELD_UINT16:
                            e = 2, f = d.U16;
                            break;

                          case a.AWD_FIELD_UINT32:
                          case a.AWD_FIELD_BADDR:
                            e = 4, f = d.U32;
                            break;

                          case a.AWD_FIELD_FLOAT32:
                            e = 4, f = d.F32;
                            break;

                          case a.AWD_FIELD_FLOAT64:
                            e = 8, f = d.F64;
                            break;

                          case a.AWD_FIELD_STRING:
                            var g = d.U16();
                            g === c && console.log("WARN may be Prefab bug / String property bug!!"), d.ptr -= 2;
                            var h = d.readUTFBytes(c);
                            return h;

                          case a.AWD_FIELD_VECTOR2x1:
                          case a.AWD_FIELD_VECTOR3x1:
                          case a.AWD_FIELD_VECTOR4x1:
                          case a.AWD_FIELD_MTX3x2:
                          case a.AWD_FIELD_MTX3x3:
                          case a.AWD_FIELD_MTX4x3:
                          case a.AWD_FIELD_MTX4x4:
                            e = 8, f = d.F64;
                        }
                        if (c > e) {
                            var i, j, k;
                            for (i = [], j = 0, k = c / e; k > j; ) i.push(f.call(d)), j++;
                            return i;
                        }
                        return f.call(d);
                    }
                }, module.exports = d;
            }();
        }, {
            bufferReader: 11,
            bufferWriter: 12,
            consts: 14,
            "types/awdString": 23
        } ],
        26: [ function(require, module, exports) {
            !function() {
                var a = require("consts"), b = require("types/awdString"), c = require("bufferWriter"), d = require("bufferReader"), e = function() {
                    this.attributes = {}, this._list = [];
                };
                e.prototype = {
                    clone: function() {
                        var a = new c(64);
                        this.write(a);
                        var b = new e();
                        return b.read(new d(a.buffer)), b;
                    },
                    addAttribute: function(a, b, c, d) {
                        var e = {
                            name: a,
                            value: b,
                            type: c,
                            ns: d
                        };
                        this.attributes[a] = e, this._list.push(e);
                    },
                    read: function(c) {
                        var d, e = c.U32();
                        if (e > 0) {
                            d = {};
                            for (var f = c.ptr + e; c.ptr < f; ) {
                                var g, h = c.U8(), i = b.read(c), j = c.U8(), k = c.U32();
                                switch (j) {
                                  case a.AWDSTRING:
                                    g = c.readUTFBytes(k);
                                    break;

                                  case a.INT8:
                                    g = c.I8();
                                    break;

                                  case a.INT16:
                                    g = c.I16();
                                    break;

                                  case a.INT32:
                                    g = c.I32();
                                    break;

                                  case a.BOOL:
                                  case a.UINT8:
                                    g = c.U8();
                                    break;

                                  case a.UINT16:
                                    g = c.U16();
                                    break;

                                  case a.UINT32:
                                  case a.BADDR:
                                    g = c.U32();
                                    break;

                                  case a.FLOAT32:
                                    g = c.F32();
                                    break;

                                  case a.FLOAT64:
                                    g = c.F64();
                                    break;

                                  default:
                                    g = "unimplemented attribute type " + j + "ns : " + h, c.ptr += k;
                                }
                                this.addAttribute(i, g, j, h), d[i] = g;
                            }
                        }
                        return d;
                    },
                    write: void 0
                }, module.exports = e;
            }();
        }, {
            bufferReader: 11,
            bufferWriter: 12,
            consts: 14,
            "types/awdString": 23
        } ],
        27: [ function(require, module, exports) {
            !function() {
                var a = require("consts"), b = require("types/properties"), c = function(a, b, c) {
                    this.x = a || 0, this.y = b || 0, this.z = c || 0;
                };
                c.prototype = {
                    parsePivot: function(c, d) {
                        var e = c.header.matrixNrType, f = new b({
                            1: e,
                            2: e,
                            3: e,
                            4: a.UINT8
                        });
                        f.read(d), this.x = f.get(1, 0), this.y = f.get(2, 0), this.z = f.get(3, 0);
                    },
                    writePivot: void 0
                }, module.exports = c;
            }();
        }, {
            consts: 14,
            "types/properties": 25
        } ],
        28: [ function(require, module, exports) {
            !function() {
                var a = (require("bufferWriter"), void 0);
                module.exports = a;
            }();
        }, {
            bufferWriter: 12
        } ],
        awdlib_pil: [ function(require, module, exports) {
            var a = require("pil/InterleavedGeometry"), b = require("pil/ext"), c = require("pil/extInfos"), d = {
                InterleavedGeometry: a,
                ext: b,
                extInfos: c
            };
            module.exports = d;
        }, {
            "pil/InterleavedGeometry": 1,
            "pil/ext": 2,
            "pil/extInfos": 3
        } ]
    }, {}, [])("awdlib_pil");
});