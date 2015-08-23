!function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a(); else if ("function" == typeof define && define.amd) define([], a); else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, 
        b.awdlib_optx = a();
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
            var a = require("awdlib"), b = a.consts, c = a.BaseElement, d = a.userAttr, e = require("optx/extInfos"), f = require("optx/Container"), g = 0, h = 1, i = c.createStruct(e.OPTX_CAMERA, e.URI, {
                init: function() {
                    this.model = b.MODEL_CAMERA, f["super"](this), this.name = "", this.extras = new d(), 
                    this.lensType = g, this.near = .1, this.far = 1e3, this.fov = 60, this.minX = -20, 
                    this.maxX = 20, this.minY = -20, this.maxY = 20, this.post = null;
                },
                makePerspective: function(a, b, c) {
                    this.lensType = g, this.fov = a, this.near = b, this.far = c;
                },
                makeOrtho: function(a, b, c, d, e, f) {
                    this.lensType = h, this.minX = a, this.maxX = b, this.minY = c, this.maxY = d, this.near = e, 
                    this.far = f;
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var c = a.U32();
                    if (this.lensType = a.U8(), this.near = a.F32(), this.far = a.F32(), this.lensType === g ? this.fov = a.F32() : this.lensType === h && (this.minX = a.F32(), 
                    this.maxX = a.F32(), this.minY = a.F32(), this.maxY = a.F32()), this.extras.read(a), 
                    c > 0) {
                        var d = this.awd.getAssetByID(c, [ b.MODEL_GENERIC ]);
                        if (d[0]) return d[1];
                        throw new Error("Could not find Post for this Camera, uid : " + c);
                    }
                    return null;
                },
                write: void 0,
                getDependencies: function() {
                    var a = this.getGraphDependencies();
                    return this.post && a.push(this.post), a;
                },
                toString: function() {
                    return "[Camera " + this.name + "]";
                }
            });
            f.extend(i.prototype), module.exports = i;
        }, {
            awdlib: "awdlib",
            "optx/Container": 3,
            "optx/extInfos": 13
        } ],
        2: [ function(require, module, exports) {
            function a(a) {
                var b, c = 3 & a >>> 6, d = 3 & a >>> 4, e = 3 & a >>> 2, f = 3 & a;
                return b = d === c ? e === c ? f === c ? h[f] : h[f] + h[e] : h[f] + h[e] + h[d] : h[f] + h[e] + h[d] + h[c];
            }
            var b = require("awdlib"), c = b.awdString, d = b.consts, e = b.BaseElement, f = b.userAttr, g = require("optx/extInfos"), h = [ "r", "g", "b", "a" ], i = e.createStruct(g.OPTX_COMPOSITE_TEXTURE, g.URI, {
                init: function() {
                    this.model = d.MODEL_TEXTURE, this.name = "", this.extras = new f(), this.components = null;
                },
                resolveTexture: function(a) {
                    var b = this.awd.getAssetByID(a, [ d.MODEL_TEXTURE ]);
                    if (b[0]) return b[1];
                    throw new Error("Could not find referenced Texture for this CompositeTexture, uid : " + a);
                },
                read: function(b) {
                    this.name = c.read(b);
                    var d = b.U8();
                    this.components = [];
                    for (var e = 0; d > e; e++) this.components.push({
                        out: a(b.U8()),
                        comps: a(b.U8()),
                        tex: this.resolveTexture(b.U32())
                    });
                    this.extras.read(b);
                },
                assertValid: function() {
                    if (null == this.components) throw new Error("CompositeTexture.write -  components are not defined");
                },
                write: void 0,
                getDependencies: function() {
                    return this.assertValid(), this.components.map(function(a) {
                        return a.tex;
                    });
                },
                toString: function() {
                    return "[CompositeTexture " + this.name + "]";
                }
            });
            module.exports = i;
        }, {
            awdlib: "awdlib",
            "optx/extInfos": 13
        } ],
        3: [ function(require, module, exports) {
            var a = require("awdlib"), b = a.awdString, c = a.consts, d = a.BaseElement, e = a.vec3, f = a.matrix, g = d.createStruct(-1, null, {
                init: function() {
                    this.model = c.MODEL_CONTAINER, g["super"](this);
                },
                readNodeCommon: function(a) {
                    var d = a.U32();
                    this.matrix.read(this.awd, a), this.pivot.parsePivot(this.awd, a), this.name = b.read(a);
                    var e = this.awd.getAssetByID(d, [ c.MODEL_CONTAINER, c.MODEL_MESH, c.MODEL_LIGHT, c.MODEL_ENTITY, c.MODEL_SEGMENT_SET ]);
                    if (e[0]) void 0 !== e[1].addChild && e[1].addChild(this), this.parent = e[1]; else if (d > 0) throw new Error("Could not find a parent for this Container id : " + d);
                },
                writeNodeCommon: void 0,
                getGraphDependencies: function() {
                    var a = this.parent;
                    return a ? [ a ] : [];
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
                a.addChild = g.prototype.addChild, a.removeChild = g.prototype.removeChild, a.writeNodeCommon = g.prototype.writeNodeCommon, 
                a.readNodeCommon = g.prototype.readNodeCommon, a.getGraphDependencies = g.prototype.getGraphDependencies;
            }, g["super"] = function(a) {
                a.parent = null, a.children = [], a.matrix = new f(), a.name = "", a.pivot = new e();
            }, module.exports = g;
        }, {
            awdlib: "awdlib"
        } ],
        4: [ function(require, module, exports) {
            function a(a) {
                return a === o ? 28 : 27;
            }
            var b = require("awdlib"), c = b.consts, d = b.BaseElement, e = b.userAttr, f = require("optx/extInfos"), g = require("optx/Container"), h = 1, i = 2, j = 3, k = 4, l = 5, m = 6, n = {};
            n[h] = c.AWD_FIELD_FLOAT32, n[i] = c.AWD_FIELD_FLOAT32, n[j] = c.AWD_FIELD_FLOAT32, 
            n[k] = c.AWD_FIELD_FLOAT32, n[l] = c.AWD_FIELD_FLOAT32, n[m] = c.AWD_FIELD_BOOL;
            var o = 0, p = d.createStruct(f.OPTX_ENV, f.URI, {
                init: function() {
                    this.model = c.MODEL_CONTAINER, g["super"](this), this.name = "", this.extras = new e(), 
                    this.shCoefs = null, this.brightness = 1, this.envMap = null;
                },
                read: function(b) {
                    this.readNodeCommon(b);
                    var d = b.U32(), e = b.U8(), f = a(e);
                    this.shCoefs = new Float32Array(f);
                    for (var g = 0; f > g; g++) this.shCoefs[g] = b.F32();
                    this.brightness = b.F32(), this.extras.read(b);
                    var h = this.awd.getAssetByID(d, [ c.MODEL_TEXTURE ]);
                    if (!h[0] && h > 0) throw new Error("Could not find EnvMap (ID = " + d + " ) for this Env");
                    d > 0 && (this.envMap = h[1]);
                },
                write: void 0,
                getDependencies: function() {
                    var a = this.getGraphDependencies();
                    return this.envMap && a.push(this.envMap), a;
                },
                toString: function() {
                    return "[Env " + this.name + "]";
                }
            });
            g.extend(p.prototype), module.exports = p;
        }, {
            awdlib: "awdlib",
            "optx/Container": 3,
            "optx/extInfos": 13
        } ],
        5: [ function(require, module, exports) {
            function a() {
                this.data = null, this.attributes = [];
            }
            function b() {
                this.data = null, this.glType = 0, this.usage = 1;
            }
            function c() {
                this.name = "", this.numElems = 0, this.glType = 0, this.flags = 0;
            }
            function d(a) {
                switch (a) {
                  case 5120:
                  case 5121:
                    return 1;

                  case 5122:
                  case 5123:
                    return 2;

                  case 5124:
                  case 5125:
                  case 5126:
                    return 4;
                }
                throw new Error("WARN getTypeSize - unexpected stream data type " + a);
            }
            var e = require("awdlib"), f = e.BaseElement, g = e.consts, h = e.awdString, i = e.userAttr, j = e.properties, k = require("optx/extInfos"), l = f.createStruct(k.OPTX_GEOM, k.URI, {
                init: function() {
                    this.model = g.MODEL_GEOMETRY, this.name = "", this.extras = new i(), this.props = new j({}), 
                    this.vertexBuffers = [], this.indexBuffers = [];
                },
                read: function(c) {
                    this.name = h.read(c);
                    var d = c.U16(), e = c.U16(), f = this.props;
                    f.read(c);
                    var g, i, j = this.vertexBuffers, k = this.indexBuffers;
                    for (g = 0; d > g; g++) i = new a(), i.read(this.awd, c), j.push(i);
                    for (g = 0; e > g; g++) i = new b(), i.read(this.awd, c), k.push(i);
                    this.extras.read(c);
                },
                write: void 0,
                toString: function() {
                    return "[OptxGeometry " + this.name + "]";
                }
            });
            a.prototype = {
                read: function(a, b) {
                    for (var d = b.U32(), e = b.U16(), f = 0; e > f; f++) {
                        var g = new c();
                        g.read(b), this.attributes.push(g);
                    }
                    this.data = b.subArray(d);
                },
                write: function(a, b) {
                    b.U32(this.data.length), b.U16(this.attributes.length);
                    for (var c = 0; c < this.attributes.length; c++) this.attributes[c].write(b);
                    b.writeSub(this.data);
                }
            }, b.prototype = {
                read: function(a, b) {
                    var c = b.U32();
                    this.glType = b.U16(), this.usage = b.U8(), this.data = b.subArray(c);
                },
                write: function(a, b) {
                    b.U32(this.data.byteLength), b.U16(this.glType), b.U8(this.usage), b.writeSub(this.data);
                }
            }, c.FLAG_NORMALIZED = 2, c.prototype = {
                read: function(a) {
                    this.name = h.read(a), this.numElems = a.U8(), this.glType = a.U16(), this.flags = a.U8();
                },
                write: function(a) {
                    h.write(this.name, a), a.U8(this.numElems), a.U16(this.glType), a.U8(this.flags);
                },
                setFlag: function(a, b) {
                    b ? this.flags = this.flags | a : this.flags = this.flags & ~a;
                },
                getFlag: function(a) {
                    return 0 !== (this.flags & a);
                },
                getBytesSize: function() {
                    return d(this.glType) * this.numElems;
                }
            }, l.types = {
                BYTE: 5120,
                UNSIGNED_BYTE: 5121,
                SHORT: 5122,
                UNSIGNED_SHORT: 5123,
                INT: 5124,
                UNSIGNED_INT: 5125,
                FLOAT: 5126
            }, l.VertexBuffer = a, l.IndexBuffer = b, l.VertexAttibute = c, l.getGLTypeBytesSize = d, 
            module.exports = l;
        }, {
            awdlib: "awdlib",
            "optx/extInfos": 13
        } ],
        6: [ function(require, module, exports) {
            var a = require("awdlib"), b = a.consts, c = a.BaseElement, d = a.userAttr, e = a.properties, f = require("optx/extInfos"), g = require("optx/Container"), h = 1, i = 2, j = 3, k = 4, l = 5, m = 6, n = {};
            n[h] = b.AWD_FIELD_FLOAT32, n[i] = b.AWD_FIELD_FLOAT32, n[j] = b.AWD_FIELD_FLOAT32, 
            n[k] = b.AWD_FIELD_FLOAT32, n[l] = b.AWD_FIELD_FLOAT32, n[m] = b.AWD_FIELD_BOOL;
            var o = c.createStruct(f.OPTX_LIGHT, f.URI, {
                init: function() {
                    this.model = b.MODEL_LIGHT, g["super"](this), this.name = "", this.extras = new d(), 
                    this.shadow = !0, this.color = [ 1, 1, 1 ], this.radius = 50, this.falloffCurve = 2, 
                    this.spotAngle = 70, this.spotShapness = 0;
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var b = new e(n);
                    b.read(a), this.readProps(b), this.extras.read(a);
                },
                write: void 0,
                setupProps: function(a) {
                    a.set(h, this.color), a.set(i, this.radius), a.set(j, this.falloffCurve), a.set(k, this.spotAngle), 
                    a.set(l, this.spotShapness), a.set(m, this.shadow);
                },
                readProps: function(a) {
                    this.color = a.get(h, this.color), this.radius = a.get(i, this.radius), this.falloffCurve = a.get(j, this.falloffCurve), 
                    this.spotAngle = a.get(k, this.spotAngle), this.spotShapness = a.get(l, this.spotShapness), 
                    this.shadow = !!a.get(m, this.shadow);
                },
                getDependencies: function() {
                    return this.getGraphDependencies();
                },
                toString: function() {
                    return "[Light " + this.name + "]";
                }
            });
            g.extend(o.prototype), module.exports = o;
        }, {
            awdlib: "awdlib",
            "optx/Container": 3,
            "optx/extInfos": 13
        } ],
        7: [ function(require, module, exports) {
            var a = require("awdlib"), b = a.awdString, c = a.consts, d = a.BaseElement, e = a.userAttr, f = a.properties, g = require("optx/extInfos"), h = 1, i = 2, j = 3, k = 4, l = 5, m = 6, n = 7, o = 8, p = 9, q = 10, r = 11, s = 12, t = 13, u = 14, v = 15, w = 16, x = 17, y = 18, z = 19, A = 20, B = 21, C = 22, D = {};
            D[h] = c.AWD_FIELD_STRING, D[i] = c.AWD_FIELD_FLOAT32, D[j] = c.AWD_FIELD_BOOL, 
            D[k] = c.AWD_FIELD_FLOAT32, D[l] = c.AWD_FIELD_FLOAT32, D[m] = c.AWD_FIELD_BOOL, 
            D[n] = c.AWD_FIELD_BOOL, D[o] = c.AWD_FIELD_BOOL, D[p] = c.AWD_FIELD_BOOL, D[q] = c.AWD_FIELD_FLOAT32, 
            D[r] = c.AWD_FIELD_FLOAT32, D[s] = c.AWD_FIELD_FLOAT32, D[t] = c.AWD_FIELD_BOOL, 
            D[u] = c.AWD_FIELD_FLOAT32, D[v] = c.AWD_FIELD_FLOAT32, D[w] = c.AWD_FIELD_FLOAT32, 
            D[x] = c.AWD_FIELD_FLOAT32, D[y] = c.AWD_FIELD_FLOAT32, D[z] = c.AWD_FIELD_FLOAT32, 
            D[A] = c.AWD_FIELD_FLOAT32, D[B] = c.AWD_FIELD_FLOAT32, D[C] = c.AWD_FIELD_BOOL;
            var E = d.createStruct(g.OPTX_MATERIAL, g.URI, {
                init: function() {
                    this.model = c.MODEL_MATERIAL, this.name = "", this.extras = new e(), this.textures = {
                        albedo: null,
                        reflectivity: null,
                        normal: null,
                        subsurface: null,
                        agt: null
                    }, this.colors = {
                        albedo: 4278190080,
                        reflectivity: 4278190080,
                        normal: 4278190080,
                        subsurface: 4278190080,
                        agt: 4278190080
                    }, this.blend = "none", this.alphaThreshold = 0, this.dithering = !1, this.fresnel = [ 1, 1, 1 ], 
                    this.horizonOcclude = 0, this.vertexColor = !1, this.vertexColorAlpha = !1, this.vertexColorSRGB = !1, 
                    this.aniso = !1, this.anisoStrength = 1, this.anisoIntegral = .5, this.anisoTangent = [ 1, 0, 0 ], 
                    this.subsurface = !1, this.subsurfaceColor = [ 1, 1, 1 ], this.transColor = [ 1, 0, 0, .5 ], 
                    this.fresnelColor = [ .2, .2, .2, .5 ], this.fresnelOcc = 1, this.fresnelGlossMask = 1, 
                    this.transSky = .5, this.shadowBlur = .5, this.normalSmooth = .5, this.unlit = !1;
                },
                read: function(a) {
                    this.name = b.read(a), this.textures.albedo = this.readTexture(a), this.textures.reflectivity = this.readTexture(a), 
                    this.textures.normal = this.readTexture(a), this.textures.subsurface = this.readTexture(a), 
                    this.textures.agt = this.readTexture(a), this.colors.albedo = a.U32(), this.colors.reflectivity = a.U32(), 
                    this.colors.normal = a.U32(), this.colors.subsurface = a.U32(), this.colors.agt = a.U32();
                    var c = new f(D);
                    c.read(a), this.readProps(c), this.extras.read(a);
                },
                write: void 0,
                readTexture: function(a) {
                    var b = a.U32();
                    if (b > 0) {
                        var d = this.awd.getAssetByID(b, [ c.MODEL_TEXTURE ]);
                        if (d[0]) return d[1];
                        throw new Error("Could not find Texture for this Material, uid : " + b);
                    }
                    return null;
                },
                writeTexture: void 0,
                setupProps: void 0,
                readProps: function(a) {
                    this.blend = a.get(h, this.blend), this.alphaThreshold = a.get(i, this.alphaThreshold), 
                    this.dithering = !!a.get(j, this.dithering), this.fresnel = a.get(k, this.fresnel), 
                    this.horizonOcclude = a.get(l, this.horizonOcclude), this.vertexColor = !!a.get(m, this.vertexColor), 
                    this.vertexColorAlpha = !!a.get(n, this.vertexColorAlpha), this.vertexColorSRGB = !!a.get(o, this.vertexColorSRGB), 
                    this.aniso = !!a.get(p, this.aniso), this.anisoStrength = a.get(q, this.anisoStrength), 
                    this.anisoIntegral = a.get(r, this.anisoIntegral), this.anisoTangent = a.get(s, this.anisoTangent), 
                    this.subsurface = !!a.get(t, this.subsurface), this.subsurfaceColor = a.get(u, this.subsurfaceColor), 
                    this.transColor = a.get(v, this.transColor), this.fresnelColor = a.get(w, this.fresnelColor), 
                    this.fresnelOcc = a.get(x, this.fresnelOcc), this.fresnelGlossMask = a.get(y, this.fresnelGlossMask), 
                    this.transSky = a.get(z, this.transSky), this.shadowBlur = a.get(A, this.shadowBlur), 
                    this.normalSmooth = a.get(B, this.normalSmooth), this.unlit = !!a.get(C, this.unlit);
                },
                getDependencies: void 0,
                toString: function() {
                    return "[Material " + this.pData.name + "]";
                }
            });
            module.exports = E;
        }, {
            awdlib: "awdlib",
            "optx/extInfos": 13
        } ],
        8: [ function(require, module, exports) {
            function a() {
                this.material = null, this.firstIndex = 0, this.indexCount = 0, this.firstWireIndex = 0, 
                this.wireIndexCount = 0;
            }
            var b = require("awdlib"), c = b.consts, d = b.BaseElement, e = b.userAttr, f = b.properties, g = require("optx/extInfos"), h = require("optx/Container"), i = {
                cullBackFaces: 1,
                castShadows: 2,
                bounds: 10
            }, j = d.createStruct(g.OPTX_MESH, g.URI, {
                init: function() {
                    this.model = c.MODEL_MESH, h["super"](this), this.geometry = null, this.extras = new e(), 
                    this.props = new f({
                        1: c.AWD_FIELD_BOOL,
                        2: c.AWD_FIELD_BOOL,
                        10: c.AWD_FIELD_FLOAT32
                    }), this.submeshes = [];
                },
                read: function(b) {
                    this.readNodeCommon(b);
                    var d = b.U32();
                    this.props.read(b);
                    for (var e = b.U16(), f = 0; e > f; f++) {
                        var g = new a();
                        g.read(this.awd, b), this.submeshes.push(g);
                    }
                    this.extras.read(b);
                    var h = this.awd.getAssetByID(d, [ c.MODEL_GEOMETRY ]);
                    h[0] && (this.geometry = h[1]);
                },
                write: void 0,
                getCullBackFace: function() {
                    return 1 === this.props.get(i.cullBackFaces, !0);
                },
                setCullBackFace: function(a) {
                    this.props.set(i.cullBackFaces, a);
                },
                getCastShadows: function() {
                    return 1 === this.props.get(i.castShadows, !1);
                },
                setCastShadows: function(a) {
                    this.props.set(i.castShadows, a);
                },
                getDependencies: function() {
                    for (var a = this.getGraphDependencies(), b = this.submeshes.length, c = 0; b > c; c++) {
                        var d = this.submeshes[c].material;
                        d && a.push(d);
                    }
                    return this.geometry && a.push(this.geometry), a;
                },
                toString: function() {
                    return "[Mesh " + this.pData.name + "]";
                }
            });
            a.prototype = {
                read: function(a, b) {
                    var d = b.U32();
                    this.firstIndex = b.U32(), this.indexCount = b.U32(), this.firstWireIndex = b.U32(), 
                    this.wireIndexCount = b.U32();
                    var e = a.getAssetByID(d, [ c.MODEL_MATERIAL ]);
                    if (!e[0] && d > 0) throw new Error("Could not find Material (ID = " + d + " ) for this SubMesh");
                    d > 0 && (this.material = e[1]);
                },
                write: function(a, b) {
                    var c = 0, d = this.material;
                    d && (c = d.chunk.id), b.U32(c), b.U32(this.firstIndex), b.U32(this.indexCount), 
                    b.U32(this.firstWireIndex), b.U32(this.wireIndexCount);
                }
            }, h.extend(j.prototype), j.SubMesh = a, module.exports = j;
        }, {
            awdlib: "awdlib",
            "optx/Container": 3,
            "optx/extInfos": 13
        } ],
        9: [ function(require, module, exports) {
            function a(a) {
                var c, j = a.U8();
                switch (j) {
                  case q:
                    c = new b();
                    break;

                  case r:
                    c = new d();
                    break;

                  case s:
                    c = new e();
                    break;

                  case t:
                    c = new f();
                    break;

                  case u:
                    c = new g();
                    break;

                  case w:
                    c = new h();
                    break;

                  case x:
                    c = new i();
                    break;

                  default:
                    throw new Error("unknown post effect type " + j);
                }
                for (var k = 0; k < c._l; k++) c.props[k] = a.F32();
                return c;
            }
            function b(a, b) {
                this._l = 2, this._id = q, this.props = [ a, b ];
            }
            function c(a, b) {
                this._l = 2, this._id = v, this.props = [ a, b ];
            }
            function d(a, b) {
                this._l = 4, this._id = r, a = a || [ 1, 1, 1 ], this.props = [ a[0], a[1], a[2], b ];
            }
            function e(a, b) {
                this._l = 5, this._id = s, a = a || [ 1, 1, 1, 1 ], this.props = [ a[0], a[1], a[2], a[3], b ];
            }
            function f(a) {
                this._l = 3, this._id = t, a = a || [ 1, 1, 1 ], this.props = [ a[0], a[1], a[2] ];
            }
            function g(a, b, c) {
                this._l = 9, this._id = u, a = a || [ 1, 1, 1 ], b = b || [ 1, 1, 1 ], c = c || [ 1, 1, 1 ], 
                this.props = [ a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2] ];
            }
            function h() {
                this._l = 0, this._id = w, this.props = [];
            }
            function i() {
                this._l = 0, this._id = x, this.props = [];
            }
            var j = require("awdlib"), k = j.consts, l = j.BaseElement, m = j.userAttr, n = j.awdString, o = require("optx/extInfos"), p = l.createStruct(o.OPTX_POST, o.URI, {
                init: function() {
                    this.model = k.MODEL_GENERIC, this.name = "", this.effects = [], this.extras = new m();
                },
                read: function(b) {
                    this.name = n.read(b), this.effects = [];
                    for (var c = b.U8(), d = 0; c > d; d++) this.effects.push(a(b));
                    this.extras.read(b);
                },
                write: void 0,
                getDependencies: function() {
                    return null;
                },
                toString: function() {
                    return "[Post " + this.name + "]";
                }
            }), q = 1, r = 2, s = 3, t = 4, u = 5, v = 6, w = 7, x = 8;
            b.prototype = {
                getAmount: function() {
                    return this.props[0];
                },
                setAmount: function(a) {
                    this.props[0] = a;
                },
                getLimit: function() {
                    return this.props[1];
                },
                setLimit: function(a) {
                    this.props[1] = a;
                }
            }, b.prototype = {
                getAmount: function() {
                    return this.props[0];
                },
                setAmount: function(a) {
                    this.props[0] = a;
                },
                getsharpness: function() {
                    return this.props[1];
                },
                setsharpness: function(a) {
                    this.props[1] = a;
                }
            }, d.prototype = {
                getColor: function() {
                    return this.props.slice(0, 3);
                },
                setColor: function(a) {
                    this.props.splice(0, 3, a[0], a[1], a[2]);
                },
                getSize: function() {
                    return this.props[1];
                },
                setSize: function(a) {
                    this.props[1] = a;
                }
            }, e.prototype = {
                getColor: function() {
                    return this.props.slice(0, 4);
                },
                setColor: function(a) {
                    this.props.splice(0, 4, a[0], a[1], a[2], a[3]);
                },
                getCurve: function() {
                    return this.props[1];
                },
                setCurve: function(a) {
                    this.props[1] = a;
                }
            }, f.prototype = {
                getRgb: function() {
                    return this.props;
                },
                setRgb: function(a) {
                    this.props = a;
                }
            }, g.prototype = {
                getBrightness: function() {
                    return this.props.slice(0, 3);
                },
                setBrightness: function(a) {
                    this.props.splice(0, 3, a[0], a[1], a[2]);
                },
                getContrast: function() {
                    return this.props.slice(3, 6);
                },
                setContrast: function(a) {
                    this.props.splice(3, 3, a[0], a[1], a[2]);
                },
                getBias: function() {
                    return this.props.slice(6, 9);
                },
                setBias: function(a) {
                    this.props.splice(6, 3, a[0], a[1], a[2]);
                }
            }, h.prototype = {}, i.prototype = {}, p.Sharpen = b, p.Bloom = d, p.Vignette = e, 
            p.Saturation = f, p.Contrast = g, p.Grain = c, p.Reinhard = h, p.Hejl = i, module.exports = p;
        }, {
            awdlib: "awdlib",
            "optx/extInfos": 13
        } ],
        10: [ function(require, module, exports) {
            var a = require("awdlib"), b = a.consts, c = a.BaseElement, d = a.userAttr, e = require("optx/extInfos"), f = require("optx/Container"), g = 0, h = 1, i = c.createStruct(e.OPTX_SKY, e.URI, {
                init: function() {
                    this.model = b.MODEL_CONTAINER, f["super"](this), this.name = "", this.extras = new d(), 
                    this.brightness = 1, this.env = null, this.skyType = 0;
                },
                useSHMode: function() {
                    this.skyType = g;
                },
                useEnvmapMode: function() {
                    this.skyType = h;
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var c = a.U32();
                    this.skyType = a.U8(), this.brightness = a.F32(), this.extras.read(a);
                    var d = this.awd.getAssetByID(c, [ b.MODEL_CONTAINER ]);
                    if (!d[0] && d > 0) throw new Error("Could not find env (ID = " + c + " ) for this Sky");
                    c > 0 && (this.env = d[1]);
                },
                write: void 0,
                getDependencies: function() {
                    var a = this.getGraphDependencies();
                    return this.env && a.push(this.env), a;
                },
                toString: function() {
                    return "[Sky " + this.name + "]";
                }
            });
            f.extend(i.prototype), module.exports = i;
        }, {
            awdlib: "awdlib",
            "optx/Container": 3,
            "optx/extInfos": 13
        } ],
        11: [ function(require, module, exports) {
            var a = require("awdlib"), b = a.awdString, c = a.consts, d = a.BaseElement, e = a.userAttr, f = require("optx/extInfos"), g = d.createStruct(f.OPTX_TEXTURE, f.URI, {
                init: function() {
                    this.model = c.MODEL_TEXTURE, this.name = "", this.extras = new e(), this.embedData = null, 
                    this.uri = null;
                },
                read: function(a) {
                    this.name = b.read(a);
                    var c = a.U8(), d = !!(1 & c);
                    if (d) {
                        var e = a.U32();
                        this.embedData = a.subArray(e);
                    } else this.uri = b.read(a);
                    this.extras.read(a);
                },
                write: void 0,
                getDependencies: function() {
                    return null;
                },
                toString: function() {
                    return "[Texture " + this.name + "]";
                }
            });
            module.exports = g;
        }, {
            awdlib: "awdlib",
            "optx/extInfos": 13
        } ],
        12: [ function(require, module, exports) {
            var a = require("awdlib"), b = a.extension, c = require("optx/Geometry"), d = require("optx/Mesh"), e = require("optx/Material"), f = require("optx/Texture"), g = require("optx/CompositeTexture"), h = require("optx/Light"), i = require("optx/Env"), j = require("optx/Sky"), k = require("optx/Camera"), l = require("optx/Post"), m = require("optx/extInfos"), n = [ c, d, e, f, g, h, i, j, k, l ], o = m;
            o.getExtension = function() {
                var a = new b(m.URI);
                return a.addStructs(n), a;
            }, module.exports = o;
        }, {
            awdlib: "awdlib",
            "optx/Camera": 1,
            "optx/CompositeTexture": 2,
            "optx/Env": 4,
            "optx/Geometry": 5,
            "optx/Light": 6,
            "optx/Material": 7,
            "optx/Mesh": 8,
            "optx/Post": 9,
            "optx/Sky": 10,
            "optx/Texture": 11,
            "optx/extInfos": 13
        } ],
        13: [ function(require, module, exports) {
            module.exports = {
                URI: "https://github.com/plepers/optx",
                OPTX_GEOM: 1,
                OPTX_MESH: 2,
                OPTX_MATERIAL: 3,
                OPTX_TEXTURE: 4,
                OPTX_COMPOSITE_TEXTURE: 5,
                OPTX_LIGHT: 6,
                OPTX_ENV: 7,
                OPTX_SKY: 8,
                OPTX_CAMERA: 9,
                OPTX_POST: 10
            };
        }, {} ],
        awdlib_optx: [ function(require, module, exports) {
            var a = require("optx/Camera"), b = require("optx/CompositeTexture"), c = require("optx/Container"), d = require("optx/Env"), e = require("optx/Geometry"), f = require("optx/Light"), g = require("optx/Material"), h = require("optx/Mesh"), i = require("optx/Post"), j = require("optx/Sky"), k = require("optx/Texture"), l = require("optx/ext"), m = require("optx/extInfos"), n = {
                Camera: a,
                CompositeTexture: b,
                Container: c,
                Env: d,
                Geometry: e,
                Light: f,
                Material: g,
                Mesh: h,
                Post: i,
                Sky: j,
                Texture: k,
                ext: l,
                extInfos: m
            };
            module.exports = n;
        }, {
            "optx/Camera": 1,
            "optx/CompositeTexture": 2,
            "optx/Container": 3,
            "optx/Env": 4,
            "optx/Geometry": 5,
            "optx/Light": 6,
            "optx/Material": 7,
            "optx/Mesh": 8,
            "optx/Post": 9,
            "optx/Sky": 10,
            "optx/Texture": 11,
            "optx/ext": 12,
            "optx/extInfos": 13
        } ]
    }, {}, [])("awdlib_optx");
});