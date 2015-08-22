!function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a(); else if ("function" == typeof define && define.amd) define([], a); else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, 
        b.awdlib_pil = a();
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
            var a = require("awdlib"), b = a.BaseElement, c = a.bufferReader, d = a.consts, e = require("std/Geometry"), f = require("pil/extInfos"), g = function() {
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
                write: function(a) {
                    var b, c, d = this.attributes;
                    for (a.U8(d.length), a.U8(this.ftype), b = 0, c = d.length; c > b; b++) {
                        var f = d[b];
                        a.U8(f.type), a.U8(f.len);
                    }
                    var g = e.getTypeSize(this.ftype), h = g - (a.ptr + 5) % g;
                    for (a.U8(h), b = 0; h > b; b++) a.U8(0);
                    var i = a.skipBlockSize(), j = e.getWriteFunc(this.ftype, a), k = this.data;
                    for (b = 0, c = k.length; c > b; b++) j.call(a, k[b]);
                    a.writeBlockSize(i);
                }
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
            awdlib: "awdlib",
            "pil/extInfos": 3,
            "std/Geometry": 4
        } ],
        2: [ function(require, module, exports) {
            var a = require("awdlib"), b = a.extension, c = require("pil/InterleavedGeometry"), d = require("pil/extInfos"), e = [ c ], f = d;
            f.getExtension = function() {
                var a = new b(d.URI);
                return a.addStructs(e), a;
            }, module.exports = f;
        }, {
            awdlib: "awdlib",
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
                    write: function(a) {
                        var c = this.subGeoms, d = c.length;
                        b.write(this.name, a), a.U16(d);
                        var e = this.awd.header.geoNrType, f = this.props;
                        f.expected[1] = e, f.expected[2] = e, f.set(1, 1), f.set(2, 1), f.write(a);
                        for (var g, h = 0; d > h; h++) g = c[h], g.write(this.awd, a);
                        this.extras.write(a);
                    },
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
            BaseElement: 6,
            consts: 10,
            "types/awdString": 11,
            "types/properties": 12,
            "types/userAttr": 13
        } ],
        5: [ function(require, module, exports) {
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
        6: [ function(require, module, exports) {
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
            chunk: 9,
            consts: 10
        } ],
        7: [ function(require, module, exports) {
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
        8: [ function(require, module, exports) {
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
            "string.prototype.codepointat": 5
        } ],
        9: [ function(require, module, exports) {
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
        10: [ function(require, module, exports) {
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
        11: [ function(require, module, exports) {
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
        12: [ function(require, module, exports) {
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
            bufferReader: 7,
            bufferWriter: 8,
            consts: 10,
            "types/awdString": 11
        } ],
        13: [ function(require, module, exports) {
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
            bufferReader: 7,
            bufferWriter: 8,
            consts: 10,
            "types/awdString": 11
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