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
        1: [ function(a, module, exports) {
            function b(a, b, d) {
                for (var e = d.transforms, f = 0; f < e.length; f++) b = c(a, b, e[f]);
                return b;
            }
            function c(a, b, c) {
                var e = c.transform.data;
                return d(a, b, e), b + 7;
            }
            function d(a, b, c) {
                a[b + 0] = c[12], a[b + 1] = c[13], a[b + 2] = c[14];
                var d = Math.sqrt(c[0] * c[0] + c[1] * c[1] + c[2] * c[2]), f = Math.sqrt(c[4] * c[4] + c[5] * c[5] + c[6] * c[6]), g = Math.sqrt(c[8] * c[8] + c[9] * c[9] + c[10] * c[10]);
                m[0] = c[0] / d, m[1] = c[1] / d, m[2] = c[2] / d, m[3] = c[4] / f, m[4] = c[5] / f, 
                m[5] = c[6] / f, m[6] = c[8] / g, m[7] = c[9] / g, m[8] = c[10] / g, e(a, b + 3, m);
            }
            function e(a, b, c) {
                var d, e = c[0] + c[4] + c[8];
                if (e > 0) d = Math.sqrt(e + 1), a[b + 3] = .5 * d, d = .5 / d, a[b + 0] = (c[5] - c[7]) * d, 
                a[b + 1] = (c[6] - c[2]) * d, a[b + 2] = (c[1] - c[3]) * d; else {
                    var f = 0;
                    c[4] > c[0] && (f = 1), c[8] > c[3 * f + f] && (f = 2);
                    var g = (f + 1) % 3, h = (f + 2) % 3;
                    d = Math.sqrt(c[3 * f + f] - c[3 * g + g] - c[3 * h + h] + 1), a[b + f] = .5 * d, 
                    d = .5 / d, a[b + 3] = (c[3 * g + h] - c[3 * h + g]) * d, a[b + g] = (c[3 * g + f] + c[3 * f + g]) * d, 
                    a[b + h] = (c[3 * h + f] + c[3 * f + h]) * d;
                }
                return a;
            }
            var f = a("types/properties"), g = a("types/awdString"), h = a("consts"), i = a("types/userAttr"), j = a("BaseElement"), k = a("./extInfos"), l = j.createStruct(k.COMPACT_SKEL_ANIM, k.URI, {
                init: function() {
                    this.name = "", this.model = h.MODEL_ANIMATION_STATE, this.extras = new i(), this.props = new f({}), 
                    this.numFrames = 0, this.numBones = 0, this.data = null;
                },
                read: function(a) {
                    this.name = g.read(a), this.numFrames = a.U16(), this.numBones = a.U16(), this.props.read(a);
                    var b = a.U8();
                    a.ptr += b;
                    var c = this.numFrames * this.numBones * 7;
                    this.data = new Float32Array(a.buffer, a.ptr, c), a.ptr += 4 * c, this.extras.read(a);
                },
                write: void 0,
                convertFromSkeletonAnimation: function(a) {
                    var c = a.frames;
                    this.numFrames = c.length, this.numBones = c[0].pose.transforms.length, this.data = new Float32Array(this.numFrames * this.numBones * 7);
                    for (var d = 0, e = 0; e < c.length; e++) d = b(this.data, d, c[e].pose);
                },
                toString: function() {
                    return "[CompactSkeletonAnimation" + this.name + "]";
                }
            }), m = new Float32Array(9);
            module.exports = l;
        }, {
            "./extInfos": 4,
            BaseElement: 7,
            consts: 13,
            "types/awdString": 15,
            "types/properties": 16,
            "types/userAttr": 17
        } ],
        2: [ function(a, module, exports) {
            function b() {
                this.name = "", this.bytesize = 0, this.gltype = 0, this.numcomps = 0, this.normalize = !1;
            }
            function c(a) {
                return new Uint8Array(a.buffer, a.offset, a.byteLength);
            }
            function d(a) {
                if (2 === a.BYTES_PER_ELEMENT) {
                    var b;
                    for (b = 0; b < a.length; b++) if (a[b] > 255) return a;
                    var c = new Uint8Array(a.length);
                    for (b = 0; b < a.length; b++) c[b] = a[b];
                }
                return a;
            }
            var e = a("../../src/BaseElement"), f = a("../../src/types/awdString"), g = a("../../src/consts"), h = a("../std/Geometry"), i = a("./extInfos"), j = 34962, k = 34963, l = 5126, m = 5123, n = 5121, o = 5125;
            b.prototype = {
                read: function(a) {
                    this.name = f.read(a), this.bytesize = a.U8(), this.gltype = a.U16();
                    var b = a.U8();
                    this.numcomps = 7 & b, this.normalize = !!(b >>> 3 & 1);
                },
                write: void 0
            };
            var p = function() {
                this.data = null, this.buffertype = j, this.attributes = [];
            };
            p.Attribute = b, p.prototype = {
                read: function(a) {
                    var c = a.U8(), d = a.U16(), e = this.attributes;
                    this.buffertype = d;
                    for (var f = 0; c > f; f++) {
                        var g = new b();
                        g.read(a), e.push(g);
                    }
                    var h = a.U8();
                    a.ptr += h;
                    var i = a.U32(), j = a.ptr + i;
                    this.data = new Uint8Array(a.buffer, a.ptr, i), a.ptr = j;
                },
                write: void 0
            };
            var q = function(a) {
                switch (a) {
                  case g.POSITION:
                    return "aPosition";

                  case g.UVS:
                    return "aTexCoord";

                  case g.NORMAL:
                    return "aNormal";

                  case g.TANGENT:
                    return "aTangent";

                  case g.JOIN_IDX:
                    return "join_index";

                  case g.JOIN_WGT:
                    return "join_weight";

                  case g.SUVS:
                    return "aTexCoord1";

                  case g.COLOR:
                    return "aColor";

                  case g.BINORMAL:
                    return "aBitangent";
                }
                return null;
            }, r = function(a) {
                var e = new h.SubGeom();
                e.extras = a.extras.clone(), e.props = a.props.clone();
                var f, g, i, r, s, t = a.buffers, u = [], v = [], w = 0;
                for (i = 0, r = t.length; r > i; i++) if (g = t[i], 2 === g.type) {
                    var x = d(g.data);
                    s = new p(), s.data = c(x), s.buffertype = k;
                    var y;
                    switch (x.BYTES_PER_ELEMENT) {
                      case 1:
                        y = n;
                        break;

                      case 2:
                        y = m;
                        break;

                      case 4:
                        y = o;
                    }
                    f = new b(), f.name = "triangles", f.gltype = y, f.numcomps = 3, f.bytesize = 6, 
                    s.attributes = [ f ], e.buffers.push(s);
                } else {
                    f = new b();
                    var z = q(g.type);
                    if (null == z) {
                        console.log("warn : unknown vertex stream type", g.type);
                        continue;
                    }
                    f.name = z, f.gltype = l, f.numcomps = g.components, f.bytesize = 4 * g.components, 
                    f.normalize = !1, u.push(f), v.push(c(g.data)), w += f.bytesize;
                }
                var A = v[0].byteLength / u[0].bytesize, B = new ArrayBuffer(w * A), C = new Uint8Array(B), D = 0;
                for (i = 0; i < u.length; i++) {
                    f = u[i];
                    for (var E = v[i], F = f.bytesize, G = 0; A > G; G++) for (var H = 0; F > H; H++) C[D + G * w + H] = E[G * F + H];
                    D += f.bytesize;
                }
                return s = new p(), s.data = C, s.buffertype = j, s.attributes = u, e.buffers.push(s), 
                e;
            }, s = e.createStruct(i.INTERLEAVED_GEOM, i.URI, h.prototype);
            s.prototype.fromGeometry = function(a) {
                this.name = a.name, this.extras = a.extras.clone(), this.props = a.props.clone();
                for (var b = 0, c = a.subGeoms.length; c > b; b++) {
                    var d = a.subGeoms[b];
                    this.subGeoms.push(r(d));
                }
            }, s.prototype.subGeomFactory = function() {
                var a = h.prototype.subGeomFactory();
                return a.bufferFactory = this.bufferFactory, a;
            }, s.prototype.bufferFactory = function() {
                return new p();
            }, s.prototype.toString = function() {
                return "[InterleavedGeometry " + this.name + "]";
            }, module.exports = s;
        }, {
            "../../src/BaseElement": 7,
            "../../src/consts": 13,
            "../../src/types/awdString": 15,
            "../std/Geometry": 5,
            "./extInfos": 4
        } ],
        3: [ function(a, module, exports) {
            var b = a("../../src/extension"), c = a("./InterleavedGeometry"), d = a("./CompactSkeletonAnimation"), e = a("./extInfos"), f = [ c, d ], g = e;
            g.getExtension = function() {
                var a = new b(e.URI);
                return a.addStructs(f), a;
            }, module.exports = g;
        }, {
            "../../src/extension": 14,
            "./CompactSkeletonAnimation": 1,
            "./InterleavedGeometry": 2,
            "./extInfos": 4
        } ],
        4: [ function(a, module, exports) {
            module.exports = {
                URI: "https://github.com/plepers/awd-js",
                INTERLEAVED_GEOM: 1,
                COMPACT_SKEL_ANIM: 2
            };
        }, {} ],
        5: [ function(a, module, exports) {
            !function() {
                "use strict";
                var b = a("consts"), c = a("types/awdString"), d = a("types/userAttr"), e = a("types/properties"), f = a("BaseElement"), g = f.createStruct(b.GEOMETRY, null, {
                    subGeomFactory: function() {
                        var a = new h();
                        return a.bufferFactory = this.bufferFactory, a;
                    },
                    bufferFactory: function() {
                        return new j();
                    },
                    init: function() {
                        this.model = b.MODEL_GEOMETRY, this.name = "", this.extras = new d(), this.props = new e({}), 
                        this.subGeoms = [];
                    },
                    read: function(a) {
                        this.name = c.read(a);
                        var b = a.U16(), d = this.awd.header.geoNrType, e = this.props;
                        e.expected[1] = d, e.expected[2] = d, e.read(a);
                        var f = e.get(1, 1), g = e.get(2, 1);
                        1 === f && 1 === g || console.log("WARN defined scale UV in geometry");
                        for (var h, i = this.subGeoms, j = 0; b > j; j++) h = this.subGeomFactory(), h.read(this.awd, a), 
                        i.push(h);
                        this.extras.read(a);
                    },
                    write: void 0,
                    toString: function() {
                        return "[Geometry " + this.name + "]";
                    }
                }), h = function() {
                    this.buffers = [], this.extras = new d(), this.props = new e({});
                };
                h.prototype = {
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
                        1 === g && 1 === h || console.log("WARN defined scale UV in sub-geometry");
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
                var i = function(a) {
                    return 2 === a ? b.AWD_FIELD_UINT16 : a;
                }, j = function() {
                    this.data = null, this.numVertices = -1, this.type = 0, this.components = 0, this.ftype = b.T_FLOAT, 
                    this.isIndex = !1;
                };
                j.HEAD_SIZE = 6, j.prototype = {
                    allocate: function(a, b) {
                        var c = n(b);
                        void 0 === c && console.log(b), this.data = new c(a);
                    },
                    solveSize: function(a) {
                        this.numVertices = a, this.components = this.data.length / a;
                    },
                    read: function(a) {
                        var c = a.U8(), d = a.U8(), e = a.U32(), f = a.ptr + e;
                        d = i(d), d !== b.AWD_FIELD_UINT8 && d !== b.AWD_FIELD_UINT16 && d !== b.AWD_FIELD_FLOAT32 && d !== b.AWD_FIELD_FLOAT64 && console.log("WARN unexpected stream data type ", d, c, e);
                        var g = o(c);
                        this.isIndex = c === b.INDEX, this.type = c, this.components = g, this.ftype = d;
                        var h = k(d), j = e / h;
                        -1 !== g && (this.numVertices = j / g), this.allocate(j, d);
                        for (var m = l(d, a), n = this.data, p = 0; a.ptr < f; ) n[p++] = m.call(a);
                    },
                    write: function(a) {
                        a.U8(this.type), a.U8(this.ftype);
                        for (var b = a.skipBlockSize(), c = m(this.ftype, a), d = this.data, e = 0, f = d.length; f > e; e++) c.call(a, d[e]);
                        a.writeBlockSize(b);
                    }
                };
                var k = function(a) {
                    switch (a) {
                      case b.AWD_FIELD_UINT8:
                        return 1;

                      case b.AWD_FIELD_UINT16:
                        return 2;

                      case b.AWD_FIELD_FLOAT32:
                        return 4;

                      case b.AWD_FIELD_FLOAT64:
                        return 8;
                    }
                    throw new Error("WARN getTypeSize - unexpected stream data type " + a);
                }, l = function(a, c) {
                    switch (a) {
                      case b.AWD_FIELD_UINT8:
                        return c.U8;

                      case b.AWD_FIELD_UINT16:
                        return c.U16;

                      case b.AWD_FIELD_FLOAT32:
                        return c.F32;

                      case b.AWD_FIELD_FLOAT64:
                        return c.F64;
                    }
                    throw new Error("WARN getReadFunc - unexpected stream data type " + a);
                }, m = function(a, c) {
                    switch (a) {
                      case b.AWD_FIELD_UINT8:
                        return c.U8;

                      case b.AWD_FIELD_UINT16:
                        return c.U16;

                      case b.AWD_FIELD_FLOAT32:
                        return c.F32;

                      case b.AWD_FIELD_FLOAT64:
                        return c.F64;
                    }
                    throw new Error("WARN getWriteFunc - unexpected stream data type " + a);
                }, n = function(a) {
                    switch (a) {
                      case b.AWD_FIELD_UINT8:
                        return Uint8Array;

                      case b.AWD_FIELD_UINT16:
                        return Uint16Array;

                      case b.AWD_FIELD_FLOAT32:
                        return Float32Array;

                      case b.AWD_FIELD_FLOAT64:
                        return Float64Array;
                    }
                    throw new Error("WARN getArray - unexpected stream data type " + a);
                }, o = function(a) {
                    switch (a) {
                      case b.POSITION:
                      case b.INDEX:
                      case b.NORMAL:
                      case b.TANGENT:
                      case b.BINORMAL:
                        return 3;

                      case b.UVS:
                        return 2;

                      case b.JOIN_WGT:
                      case b.JOIN_IDX:
                        return -1;

                      default:
                        return -1;
                    }
                };
                g.SubGeom = h, g.VertexBuffer = j, g.getTypeSize = k, g.getReadFunc = l, g.getWriteFunc = m, 
                g.getArray = n, g.fixC4D_Type = i, module.exports = g;
            }();
        }, {
            BaseElement: 7,
            consts: 13,
            "types/awdString": 15,
            "types/properties": 16,
            "types/userAttr": 17
        } ],
        6: [ function(a, module, exports) {
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
                    if (d != d && (d = 0), !(0 > d || d >= c)) {
                        var e, f = b.charCodeAt(d);
                        return f >= 55296 && 56319 >= f && c > d + 1 && (e = b.charCodeAt(d + 1), e >= 56320 && 57343 >= e) ? 1024 * (f - 55296) + e - 56320 + 65536 : f;
                    }
                };
                a ? a(String.prototype, "codePointAt", {
                    value: b,
                    configurable: !0,
                    writable: !0
                }) : String.prototype.codePointAt = b;
            }();
        }, {} ],
        7: [ function(a, module, exports) {
            !function() {
                var b = a("./consts"), c = a("./chunk"), d = {
                    _setup: function(a, b) {
                        this.awd = a, this.chunk = b, this.id = b.id;
                    },
                    init: function() {
                        this.injectDeps = !1, this.model = b.MODEL_GENERIC;
                    },
                    getDependencies: function() {
                        return this.deps ? this.deps : null;
                    },
                    prepareAndAdd: void 0,
                    prepareChunk: function() {
                        null === this.chunk && (this.chunk = new c()), this.chunk.type = this.type, this.chunk.ns = this.ns;
                    }
                }, e = {};
                e.createStruct = function(a, b, c) {
                    var e = function() {
                        this.type = a, this.nsUri = b, this.ns = 0, this.injectDeps = !0, this.init(), this.chunk = null, 
                        this.id = -1;
                    };
                    e.TYPE = a;
                    var f;
                    for (f in d) e.prototype[f] = d[f];
                    for (f in c) e.prototype[f] = c[f];
                    return e;
                }, module.exports = e;
            }();
        }, {
            "./chunk": 12,
            "./consts": 13
        } ],
        8: [ function(a, module, exports) {
            var b = a("./consts"), c = a("./BaseElement"), d = c.createStruct(b.GENERIC, -1, {
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
            module.exports = d;
        }, {
            "./BaseElement": 7,
            "./consts": 13
        } ],
        9: [ function(a, module, exports) {
            !function() {
                var b = a("./types/awdString"), c = a("./consts"), d = a("./BaseElement"), e = d.createStruct(c.NAMESPACE, null, {
                    init: function() {
                        this.uri = "", this.nsId = 0;
                    },
                    read: function(a) {
                        this.nsId = a.U8(), this.uri = b.read(a);
                    },
                    write: void 0
                });
                module.exports = e;
            }();
        }, {
            "./BaseElement": 7,
            "./consts": 13,
            "./types/awdString": 15
        } ],
        10: [ function(a, module, exports) {
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
                        0 !== b && (128 > b ? f[g++] = String.fromCharCode(b) : b > 191 && 224 > b ? (c = this.U8(), 
                        f[g++] = String.fromCharCode((31 & b) << 6 | 63 & c)) : (c = this.U8(), d = this.U8(), 
                        f[g++] = String.fromCharCode((15 & b) << 12 | (63 & c) << 6 | 63 & d)));
                        return f.join("");
                    }
                }, module.exports = a;
            }();
        }, {} ],
        11: [ function(a, module, exports) {
            module.exports = {};
        }, {
            "string.prototype.codepointat": 6
        } ],
        12: [ function(a, module, exports) {
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
        13: [ function(a, module, exports) {
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
                    SKELETON: 101,
                    SKELETON_POSE: 102,
                    SKELETON_ANIMATION: 103,
                    ANIMATION_SET: 113,
                    ANIMATOR: 122,
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
                    BINORMAL: 12,
                    DEFAULT_NS: 0
                };
                module.exports = a;
            }();
        }, {} ],
        14: [ function(a, module, exports) {
            var b = a("./DefaultElement"), c = a("./Namespace"), d = function(a) {
                this.nsUri = a, this.structs = [], this.nsId = 0;
            };
            d.prototype = {
                addStruct: function(a) {
                    this.structs.push(a);
                },
                addStructs: function(a) {
                    for (var b = 0, c = a.length; c > b; b++) this.addStruct(a[b]);
                },
                create: function(a) {
                    for (var c, d = this.structs, e = 0, f = d.length; f > e; e++) if (c = d[e], c.TYPE === a) return new c();
                    return new b();
                },
                createNamespace: function() {
                    var a = new c();
                    return a.uri = this.nsUri, a;
                }
            }, module.exports = d;
        }, {
            "./DefaultElement": 8,
            "./Namespace": 9
        } ],
        15: [ function(a, module, exports) {
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
        16: [ function(a, module, exports) {
            !function() {
                var b = a("../consts"), c = (a("./awdString"), a("../bufferWriter")), d = a("../bufferReader"), e = function(a) {
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
                    write: void 0,
                    set: function(a, b) {
                        this.vars[a] = b;
                    },
                    get: function(a, b) {
                        return this.vars.hasOwnProperty(a) ? this.vars[a] : b;
                    },
                    writeAttrValue: void 0,
                    parseAttrValue: function(a, c, d) {
                        var e, f;
                        switch (a) {
                          case b.AWD_FIELD_INT8:
                            e = 1, f = d.I8;
                            break;

                          case b.AWD_FIELD_INT16:
                            e = 2, f = d.I16;
                            break;

                          case b.AWD_FIELD_INT32:
                            e = 4, f = d.I32;
                            break;

                          case b.AWD_FIELD_BOOL:
                          case b.AWD_FIELD_UINT8:
                            e = 1, f = d.U8;
                            break;

                          case b.AWD_FIELD_UINT16:
                            e = 2, f = d.U16;
                            break;

                          case b.AWD_FIELD_UINT32:
                          case b.AWD_FIELD_BADDR:
                            e = 4, f = d.U32;
                            break;

                          case b.AWD_FIELD_FLOAT32:
                            e = 4, f = d.F32;
                            break;

                          case b.AWD_FIELD_FLOAT64:
                            e = 8, f = d.F64;
                            break;

                          case b.AWD_FIELD_STRING:
                            var g = d.U16();
                            g === c && console.log("WARN may be Prefab bug / String property bug!!"), d.ptr -= 2;
                            var h = d.readUTFBytes(c);
                            return h;

                          case b.AWD_FIELD_VECTOR2x1:
                          case b.AWD_FIELD_VECTOR3x1:
                          case b.AWD_FIELD_VECTOR4x1:
                          case b.AWD_FIELD_MTX3x2:
                          case b.AWD_FIELD_MTX3x3:
                          case b.AWD_FIELD_MTX4x3:
                          case b.AWD_FIELD_MTX4x4:
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
            "../bufferReader": 10,
            "../bufferWriter": 11,
            "../consts": 13,
            "./awdString": 15
        } ],
        17: [ function(a, module, exports) {
            !function() {
                var b = a("../consts"), c = a("./awdString"), d = a("../bufferWriter"), e = a("../bufferReader"), f = function() {
                    this.attributes = {}, this._list = [];
                };
                f.prototype = {
                    clone: function() {
                        var a = new d(64);
                        this.write(a);
                        var b = new f();
                        return b.read(new e(a.buffer)), b;
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
                    read: function(a) {
                        var d, e = a.U32();
                        if (e > 0) {
                            d = {};
                            for (var f = a.ptr + e; a.ptr < f; ) {
                                var g, h = a.U8(), i = c.read(a), j = a.U8(), k = a.U32();
                                switch (j) {
                                  case b.AWDSTRING:
                                    g = a.readUTFBytes(k);
                                    break;

                                  case b.INT8:
                                    g = a.I8();
                                    break;

                                  case b.INT16:
                                    g = a.I16();
                                    break;

                                  case b.INT32:
                                    g = a.I32();
                                    break;

                                  case b.BOOL:
                                  case b.UINT8:
                                    g = a.U8();
                                    break;

                                  case b.UINT16:
                                    g = a.U16();
                                    break;

                                  case b.UINT32:
                                  case b.BADDR:
                                    g = a.U32();
                                    break;

                                  case b.FLOAT32:
                                    g = a.F32();
                                    break;

                                  case b.FLOAT64:
                                    g = a.F64();
                                    break;

                                  default:
                                    g = "unimplemented attribute type " + j + "ns : " + h, a.ptr += k;
                                }
                                this.addAttribute(i, g, j, h), d[i] = g;
                            }
                        }
                        return d;
                    },
                    write: void 0
                }, module.exports = f;
            }();
        }, {
            "../bufferReader": 10,
            "../bufferWriter": 11,
            "../consts": 13,
            "./awdString": 15
        } ],
        awdlib_pil: [ function(a, module, exports) {
            module.exports = {
                InterleavedGeometry: a("./InterleavedGeometry"),
                CompactSkeletonAnimation: a("./CompactSkeletonAnimation"),
                ext: a("./ext"),
                extInfos: a("./extInfos")
            };
        }, {
            "./CompactSkeletonAnimation": 1,
            "./InterleavedGeometry": 2,
            "./ext": 3,
            "./extInfos": 4
        } ]
    }, {}, [])("awdlib_pil");
});