!function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a(); else if ("function" == typeof define && define.amd) define([], a); else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, 
        b.awdlib_std = a();
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
            !function() {
                var a = require("types/userAttr"), b = require("types/awdString"), c = require("types/vec3"), d = require("types/matrix"), e = require("consts"), f = require("BaseElement"), g = f.createStruct(e.CONTAINER, null, {
                    init: function() {
                        this.model = e.MODEL_CONTAINER, g["super"](this);
                    },
                    read: function(a) {
                        var c = a.U32();
                        this.matrix.read(this.awd, a), this.name = b.read(a), this.pivot.parsePivot(this.awd, a), 
                        this.extras.read(a);
                        var d = this.awd.getAssetByID(c, [ e.MODEL_CONTAINER, e.MODEL_MESH, e.MODEL_LIGHT, e.MODEL_ENTITY, e.MODEL_SEGMENT_SET ]);
                        if (d[0]) void 0 !== d[1].addChild && d[1].addChild(this), this.parent = d[1]; else if (c > 0) throw new Error("Could not find a parent for this ObjectContainer3D id : " + c);
                    },
                    write: function(a) {
                        var c = 0, d = this.parent;
                        d && (c = d.chunk.id), a.U32(c), this.matrix.write(this.awd, a), b.write(this.name, a), 
                        this.pivot.writePivot(this.awd, a), this.extras.write(a);
                    },
                    getDependencies: function() {
                        var a = this.parent;
                        return a ? [ a ] : null;
                    },
                    toString: function() {
                        return "[Container " + this.name + "]";
                    },
                    addChild: function(a) {
                        -1 === this.children.indexOf(a) && (this.children.push(a), a.parent = this);
                    },
                    removeChild: function(a) {
                        var b = this.children.indexOf(a);
                        b > -1 && (this.children.splice(b, 1), a.parent = null);
                    }
                });
                g.extend = function(a) {
                    a.addChild = g.prototype.addChild, a.removeChild = g.prototype.removeChild;
                }, g["super"] = function(b) {
                    b.parent = null, b.children = [], b.matrix = new d(), b.name = "", b.pivot = new c(), 
                    b.extras = new a();
                }, module.exports = g;
            }();
        }, {
            BaseElement: 10,
            consts: 16,
            "types/awdString": 18,
            "types/matrix": 19,
            "types/userAttr": 21,
            "types/vec3": 22
        } ],
        2: [ function(require, module, exports) {
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
            BaseElement: 10,
            consts: 16,
            "types/awdString": 18,
            "types/properties": 20,
            "types/userAttr": 21
        } ],
        3: [ function(require, module, exports) {
            !function() {
                var a = require("types/properties"), b = require("types/awdString"), c = require("consts"), d = require("BaseElement"), e = d.createStruct(c.MATERIAL, null, {
                    init: function() {
                        this.name = "", this.model = c.MODEL_MATERIAL;
                    },
                    read: function(d) {
                        this.name = b.read(d), this.type = d.U8(), this.numMethods = d.U8();
                        var e = this.awd.header.propsNrType;
                        this.props = new a({
                            1: c.UINT32,
                            2: c.BADDR,
                            3: c.BADDR,
                            4: c.UINT8,
                            5: c.BOOL,
                            6: c.BOOL,
                            7: c.BOOL,
                            8: c.BOOL,
                            9: c.UINT8,
                            10: e,
                            11: c.BOOL,
                            12: e,
                            13: c.BOOL,
                            15: e,
                            16: c.UINT32,
                            17: c.BADDR,
                            18: e,
                            19: e,
                            20: c.UINT32,
                            21: c.BADDR,
                            22: c.BADDR
                        }), this.props.read(d);
                    },
                    write: function(a) {
                        b.write(this.name, a), a.U8(this.type), a.U8(this.numMethods), this.props.write(a);
                    },
                    toString: function() {}
                });
                module.exports = e;
            }();
        }, {
            BaseElement: 10,
            consts: 16,
            "types/awdString": 18,
            "types/properties": 20
        } ],
        4: [ function(require, module, exports) {
            !function() {
                var a = require("types/awdString"), b = require("std/Container"), c = require("consts"), d = require("BaseElement"), e = d.createStruct(c.MESH, null, {
                    init: function() {
                        this.model = c.MODEL_MESH, this.pData = {}, b["super"](this), this.geometry = null, 
                        this.materials = [];
                    },
                    read: function(b) {
                        var d = b.U32();
                        this.matrix.read(this.awd, b), this.name = a.read(b);
                        for (var e = b.U32(), f = b.U16(), g = 0; f > g; g++) {
                            var h = b.U32(), i = this.awd.getAssetByID(h, [ c.MODEL_MATERIAL ]);
                            if (!i[0] && h > 0) throw new Error("Could not find Material Nr " + g + " (ID = " + h + " ) for this Mesh");
                            h > 0 && this.materials.push(i[1]);
                        }
                        this.pivot.parsePivot(this.awd, b), this.extras.read(b);
                        var j = this.awd.getAssetByID(e, [ c.MODEL_GEOMETRY ]);
                        if (j[0] && (this.geometry = j[1]), j = this.awd.getAssetByID(d, [ c.MODEL_CONTAINER, c.MODEL_MESH, c.MODEL_LIGHT, c.MODEL_ENTITY, c.MODEL_SEGMENT_SET ]), 
                        j[0]) void 0 !== j[1].addChild && j[1].addChild(this), this.parent = j[1]; else if (d > 0) throw new Error("Could not find a parent for this Mesh " + d);
                    },
                    write: function(b) {
                        var c = 0, d = this.parent;
                        d && (c = d.chunk.id);
                        var e = 0, f = this.geometry;
                        f && (e = f.chunk.id), b.U32(c), this.matrix.write(this.awd, b), a.write(this.name, b), 
                        b.U32(e);
                        var g = this.materials.length;
                        b.U16(g);
                        for (var h = 0; g > h; h++) {
                            var i = this.materials[h];
                            b.U32(i.chunk.id);
                        }
                        this.pivot.writePivot(this.awd, b), this.extras.write(b);
                    },
                    getDependencies: function() {
                        for (var a = [], b = this.materials.length, c = 0; b > c; c++) {
                            var d = this.materials[c];
                            a.push(d);
                        }
                        return this.parent && a.push(this.parent), this.geometry && a.push(this.geometry), 
                        a;
                    },
                    toString: function() {
                        return "[Mesh " + this.pData.name + "]";
                    }
                });
                b.extend(e.prototype), module.exports = e;
            }();
        }, {
            BaseElement: 10,
            consts: 16,
            "std/Container": 1,
            "types/awdString": 18
        } ],
        5: [ function(require, module, exports) {
            !function() {
                var a = require("consts"), b = require("types/properties"), c = require("BaseElement"), d = "unknown", e = c.createStruct(a.METADATA, null, {
                    init: function() {
                        this.timeStamp = 0, this.encoderName = d, this.encoderVersion = d, this.generatorName = d, 
                        this.generatorVersion = d;
                    },
                    read: function(c) {
                        var e = new b({
                            1: a.AWD_FIELD_UINT32,
                            2: a.AWD_FIELD_STRING,
                            3: a.AWD_FIELD_STRING,
                            4: a.AWD_FIELD_STRING,
                            5: a.AWD_FIELD_STRING
                        });
                        e.read(c), this.timeStamp = e.get(1, 0), this.encoderName = e.get(2, d), this.encoderVersion = e.get(3, d), 
                        this.generatorName = e.get(4, d), this.generatorVersion = e.get(5, d);
                    },
                    write: function(c) {
                        var d = new b({
                            1: a.AWD_FIELD_UINT32,
                            2: a.AWD_FIELD_STRING,
                            3: a.AWD_FIELD_STRING,
                            4: a.AWD_FIELD_STRING,
                            5: a.AWD_FIELD_STRING
                        });
                        d.set(1, this.timeStamp), d.set(2, this.encoderName), d.set(3, this.encoderVersion), 
                        d.set(4, this.generatorName), d.set(5, this.generatorVersion), d.write(c);
                    },
                    toString: function() {
                        return "Metadata : TimeStamp         = " + this.timeStamp + " EncoderName       = " + this.encoderName + " EncoderVersion    = " + this.encoderVersion + " GeneratorName     = " + this.generatorName + " GeneratorVersion  = " + this.generatorVersion;
                    }
                });
                module.exports = e;
            }();
        }, {
            BaseElement: 10,
            consts: 16,
            "types/properties": 20
        } ],
        6: [ function(require, module, exports) {
            !function() {
                var a = require("types/properties"), b = require("types/awdString"), c = require("consts"), d = require("BaseElement"), e = d.createStruct(c.PRIMITIVE, null, {
                    init: function() {
                        this.name = "", this.model = c.MODEL_GEOMETRY;
                    },
                    read: function(a) {
                        this.name = b.read(a), this.type = a.U8();
                        var c = this._createProps();
                        c.read(a);
                        var d;
                        switch (this.type) {
                          case 1:
                            d = this.makePlane(c);
                            break;

                          case 2:
                            d = this.makeCube(c);
                            break;

                          case 3:
                            d = this.makeSphere(c);
                            break;

                          case 4:
                            d = this.makeCylinder(c);
                            break;

                          case 5:
                            d = this.makeCone(c);
                            break;

                          case 6:
                            d = this.makeCapsule(c);
                            break;

                          case 7:
                            d = this.makeTorus(c);
                            break;

                          default:
                            throw new Error("unknown primitive type " + this.type);
                        }
                        this.geom = d;
                    },
                    write: function(a) {
                        if (b.write(this.name, a), !this.geom) throw new Error("Primitive geom is not defined");
                        a.U8(this.geom._tId);
                        var c = this._createProps();
                        switch (this.geom.type) {
                          case 1:
                            this.setupPropsPlane(this.geom, c);
                            break;

                          case 2:
                            this.setupPropsCube(this.geom, c);
                            break;

                          case 3:
                            this.setupPropsSphere(this.geom, c);
                            break;

                          case 4:
                            this.setupPropsCylinder(this.geom, c);
                            break;

                          case 5:
                            this.setupPropsCone(this.geom, c);
                            break;

                          case 6:
                            this.setupPropsCapsule(this.geom, c);
                            break;

                          case 7:
                            this.setupPropsTorus(this.geom, c);
                            break;

                          default:
                            throw new Error("unknown primitive type " + this.geom.type);
                        }
                        c.write(a);
                    },
                    _createProps: function() {
                        var b = this.awd.header.geoNrType;
                        return new a({
                            101: b,
                            102: b,
                            103: b,
                            110: b,
                            111: b,
                            301: c.UINT16,
                            302: c.UINT16,
                            303: c.UINT16,
                            701: c.BOOL,
                            702: c.BOOL,
                            703: c.BOOL,
                            704: c.BOOL
                        });
                    },
                    toString: function() {},
                    makePlane: function(a) {
                        var b = {
                            _tId: 1,
                            type: "plane",
                            width: 100,
                            height: 100,
                            segmentsW: 1,
                            segmentsH: 1,
                            yUp: !0,
                            doubleSided: !1
                        };
                        return a && this.setupPlane(b, a), b;
                    },
                    makeCube: function(a) {
                        var b = {
                            _tId: 2,
                            type: "cube",
                            width: 100,
                            height: 100,
                            depth: 100,
                            segmentsW: 1,
                            segmentsH: 1,
                            segmentsD: 1,
                            tile6: !0
                        };
                        return a && this.setupCube(b, a), b;
                    },
                    makeSphere: function(a) {
                        var b = {
                            _tId: 3,
                            type: "sphere",
                            radius: 100,
                            segmentsW: 16,
                            segmentsH: 12,
                            yUp: !0
                        };
                        return a && this.setupSphere(b, a), b;
                    },
                    makeCylinder: function(a) {
                        var b = {
                            _tId: 4,
                            type: "cylinder",
                            topRadius: 50,
                            bottomRadius: 50,
                            height: 100,
                            segmentsW: 16,
                            segmentsH: 1,
                            topClosed: !0,
                            bottomClosed: !0,
                            surfaceClosed: !0,
                            yUp: !0
                        };
                        return a && this.setupCylinder(b, a), b;
                    },
                    makeCone: function(a) {
                        var b = {
                            _tId: 5,
                            type: "cone",
                            radius: 50,
                            height: 100,
                            segmentsW: 16,
                            segmentsH: 1,
                            closed: !0,
                            yUp: !0
                        };
                        return a && this.setupCone(b, a), b;
                    },
                    makeCapsule: function(a) {
                        var b = {
                            _tId: 6,
                            type: "capsule",
                            radius: 50,
                            height: 100,
                            segmentsW: 16,
                            segmentsH: 15,
                            yUp: !0
                        };
                        return a && this.setupCapsule(b, a), b;
                    },
                    makeTorus: function(a) {
                        var b = {
                            _tId: 7,
                            type: "torus",
                            radius: 50,
                            tubeRadius: 50,
                            segmentsR: 16,
                            segmentsT: 8,
                            yUp: !0
                        };
                        return a && this.setupTorus(b, a), b;
                    },
                    setupPlane: function(a, b) {
                        a.width = b.get(101, 100), a.height = b.get(102, 100), a.segmentsW = b.get(301, 1), 
                        a.segmentsH = b.get(302, 1), a.yUp = b.get(701, !0), a.doubleSided = b.get(702, !1);
                    },
                    setupCube: function(a, b) {
                        a.width = b.get(101, 100), a.height = b.get(102, 100), a.depth = b.get(103, 100), 
                        a.segmentsW = b.get(301, 1), a.segmentsH = b.get(302, 1), a.segmentsD = b.get(303, 1), 
                        a.tile6 = b.get(701, !0);
                    },
                    setupSphere: function(a, b) {
                        a.radius = b.get(101, 100), a.segmentsW = b.get(301, 16), a.segmentsH = b.get(302, 12), 
                        a.yUp = b.get(701, !0);
                    },
                    setupCylinder: function(a, b) {
                        a.topRadius = b.get(101, 50), a.bottomRadius = b.get(102, 50), a.height = b.get(103, 100), 
                        a.segmentsW = b.get(301, 16), a.segmentsH = b.get(302, 1), a.topClosed = b.get(701, !0), 
                        a.bottomClosed = b.get(702, !0), a.yUp = b.get(703, !0);
                    },
                    setupCone: function(a, b) {
                        a.radius = b.get(101, 50), a.height = b.get(102, 100), a.segmentsW = b.get(301, 16), 
                        a.segmentsH = b.get(302, 1), a.closed = b.get(701, !0), a.yUp = b.get(702, !0);
                    },
                    setupCapsule: function(a, b) {
                        a.radius = b.get(101, 50), a.height = b.get(102, 100), a.segmentsW = b.get(301, 16), 
                        a.segmentsH = b.get(302, 15), a.yUp = b.get(701, !0);
                    },
                    setupTorus: function(a, b) {
                        a.radius = b.get(101, 50), a.tubeRadius = b.get(102, 50), a.segmentsR = b.get(301, 16), 
                        a.segmentsT = b.get(302, 8), a.yUp = b.get(701, !0);
                    },
                    setupPropsPlane: function(a, b) {
                        b.set(101, a.width), b.set(102, a.height), b.set(301, a.segmentsW), b.set(302, a.segmentsH), 
                        b.set(701, a.yUp), b.set(702, a.doubleSided);
                    },
                    setupPropsCube: function(a, b) {
                        b.set(101, a.width), b.set(102, a.height), b.set(103, a.depth), b.set(301, a.segmentsW), 
                        b.set(302, a.segmentsH), b.set(303, a.segmentsD), b.set(701, a.tile6);
                    },
                    setupPropsSphere: function(a, b) {
                        b.set(101, a.radius), b.set(301, a.segmentsW), b.set(302, a.segmentsH), b.set(701, a.yUp);
                    },
                    setupPropsCylinder: function(a, b) {
                        b.set(101, a.topRadius), b.set(102, a.bottomRadius), b.set(103, a.height), b.set(301, a.segmentsW), 
                        b.set(302, a.segmentsH), b.set(701, a.topClosed), b.set(702, a.bottomClosed), b.set(703, a.yUp);
                    },
                    setupPropsCone: function(a, b) {
                        b.set(101, a.radius), b.set(102, a.height), b.set(301, a.segmentsW), b.set(302, a.segmentsH), 
                        b.set(701, a.closed), b.set(702, a.yUp);
                    },
                    setupPropsCapsule: function(a, b) {
                        b.set(101, a.radius), b.set(102, a.height), b.set(301, a.segmentsW), b.set(302, a.segmentsH), 
                        b.set(701, a.yUp);
                    },
                    setupPropsTorus: function(a, b) {
                        b.set(101, a.radius), b.set(102, a.tubeRadius), b.set(301, a.segmentsR), b.set(302, a.segmentsT), 
                        b.set(701, a.yUp);
                    }
                });
                module.exports = e;
            }();
        }, {
            BaseElement: 10,
            consts: 16,
            "types/awdString": 18,
            "types/properties": 20
        } ],
        7: [ function(require, module, exports) {
            !function() {
                var a = require("types/properties"), b = require("types/awdString"), c = require("consts"), d = require("types/userAttr"), e = require("BaseElement"), f = e.createStruct(c.TEXTURE, null, {
                    init: function() {
                        this.name = "", this.type = 0, this.url = null, this.data = null, this.extras = new d(), 
                        this.model = c.MODEL_TEXTURE;
                    },
                    read: function(c) {
                        this.name = b.read(c), this.type = c.U8();
                        var d = c.U32();
                        0 === this.type ? (this.url = c.readUTFBytes(d), console.log(this.url)) : (this.data = new ArrayBuffer(d), 
                        c.readBytes(this.data, d)), new a().read(c), this.extras.read(c);
                    },
                    write: function(a) {
                        b.write(this.name, a), a.U8(this.type);
                        var c = a.skipBlockSize();
                        null !== this.url && null === this.data ? a.writeUTFBytes(this.url) : null === this.url && null !== this.data && a.writeBytes(this.data), 
                        a.writeBlockSize(c), this.extras.write(a);
                    },
                    toString: function() {}
                });
                module.exports = f;
            }();
        }, {
            BaseElement: 10,
            consts: 16,
            "types/awdString": 18,
            "types/properties": 20,
            "types/userAttr": 21
        } ],
        8: [ function(require, module, exports) {
            var a = require("extension"), b = require("DefaultElement"), c = require("std/Metadata"), d = require("std/Container"), e = require("std/Mesh"), f = require("std/Texture"), g = require("std/Geometry"), h = [ b, c, d, e, f, g ], i = {};
            i.getExtension = function() {
                var b = new a(null);
                return b.addStructs(h), b;
            }, module.exports = i;
        }, {
            DefaultElement: 11,
            extension: 17,
            "std/Container": 1,
            "std/Geometry": 2,
            "std/Mesh": 4,
            "std/Metadata": 5,
            "std/Texture": 7
        } ],
        9: [ function(require, module, exports) {
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
        10: [ function(require, module, exports) {
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
            chunk: 15,
            consts: 16
        } ],
        11: [ function(require, module, exports) {
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
            BaseElement: 10,
            consts: 16
        } ],
        12: [ function(require, module, exports) {
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
            BaseElement: 10,
            consts: 16,
            "types/awdString": 18
        } ],
        13: [ function(require, module, exports) {
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
        14: [ function(require, module, exports) {
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
            "string.prototype.codepointat": 9
        } ],
        15: [ function(require, module, exports) {
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
        16: [ function(require, module, exports) {
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
        17: [ function(require, module, exports) {
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
            DefaultElement: 11,
            Namespace: 12
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
            bufferReader: 13,
            bufferWriter: 14,
            consts: 16,
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
            bufferReader: 13,
            bufferWriter: 14,
            consts: 16,
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
            consts: 16,
            "types/properties": 20
        } ],
        awdlib_std: [ function(require, module, exports) {
            var a = require("std/Container"), b = require("std/Geometry"), c = require("std/Material"), d = require("std/Mesh"), e = require("std/Metadata"), f = require("std/Primitive"), g = require("std/Texture"), h = require("std/ext"), i = {
                Container: a,
                Geometry: b,
                Material: c,
                Mesh: d,
                Metadata: e,
                Primitive: f,
                Texture: g,
                ext: h
            };
            module.exports = i;
        }, {
            "std/Container": 1,
            "std/Geometry": 2,
            "std/Material": 3,
            "std/Mesh": 4,
            "std/Metadata": 5,
            "std/Primitive": 6,
            "std/Texture": 7,
            "std/ext": 8
        } ]
    }, {}, [])("awdlib_std");
});