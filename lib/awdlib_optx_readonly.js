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
        1: [ function(a, module, exports) {
            var b = a("../../src/BaseElement"), c = a("../../src/types/userAttr"), d = a("../../src/consts"), e = a("optx/extInfos"), f = a("optx/Container"), g = 0, h = 1, i = b.createStruct(e.OPTX_CAMERA, e.URI, {
                init: function() {
                    this.model = d.MODEL_CAMERA, f["super"](this), this.name = "", this.extras = new c(), 
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
                    var b = a.U32();
                    if (this.lensType = a.U8(), this.near = a.F32(), this.far = a.F32(), this.lensType === g ? this.fov = a.F32() : this.lensType === h && (this.minX = a.F32(), 
                    this.maxX = a.F32(), this.minY = a.F32(), this.maxY = a.F32()), this.extras.read(a), 
                    b > 0) {
                        var c = this.awd.getAssetByID(b, [ d.MODEL_GENERIC ]);
                        if (c[0]) return c[1];
                        throw new Error("Could not find Post for this Camera, uid : " + b);
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
            i.LENS_PERSPECTIVE = g, i.LENS_ORTHOGRAPHIC = h, f.extend(i.prototype), module.exports = i;
        }, {
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/userAttr": 27,
            "optx/Container": 3,
            "optx/extInfos": 14
        } ],
        2: [ function(a, module, exports) {
            function b(a) {
                var b, c = 3 & a >>> 6, d = 3 & a >>> 4, e = 3 & a >>> 2, f = 3 & a;
                return b = d === c ? e === c ? f === c ? h[f] : h[f] + h[e] : h[f] + h[e] + h[d] : h[f] + h[e] + h[d] + h[c];
            }
            var c = a("../../src/BaseElement"), d = a("../../src/types/userAttr"), e = a("../../src/types/awdString"), f = a("../../src/consts"), g = a("optx/extInfos"), h = [ "r", "g", "b", "a" ], i = c.createStruct(g.OPTX_COMPOSITE_TEXTURE, g.URI, {
                init: function() {
                    this.model = f.MODEL_TEXTURE, this.name = "", this.extras = new d(), this.components = null;
                },
                resolveTexture: function(a) {
                    var b = this.awd.getAssetByID(a, [ f.MODEL_TEXTURE ]);
                    if (b[0]) return b[1];
                    throw new Error("Could not find referenced Texture for this CompositeTexture, uid : " + a);
                },
                read: function(a) {
                    this.name = e.read(a);
                    var c = a.U8();
                    this.components = [];
                    for (var d = 0; c > d; d++) this.components.push({
                        out: b(a.U8()),
                        comps: b(a.U8()),
                        tex: this.resolveTexture(a.U32())
                    });
                    this.extras.read(a);
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
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/awdString": 24,
            "../../src/types/userAttr": 27,
            "optx/extInfos": 14
        } ],
        3: [ function(a, module, exports) {
            var b = a("../../src/BaseElement"), c = a("../../src/types/awdString"), d = a("../../src/types/vec3"), e = a("../../src/types/matrix"), f = a("../../src/consts"), g = b.createStruct(-1, null, {
                init: function() {
                    this.model = f.MODEL_CONTAINER, g["super"](this);
                },
                readNodeCommon: function(a) {
                    var b = a.U32();
                    this.matrix.read(this.awd, a), this.pivot.parsePivot(this.awd, a), this.name = c.read(a);
                    var d = this.awd.getAssetByID(b, [ f.MODEL_CONTAINER, f.MODEL_MESH, f.MODEL_LIGHT, f.MODEL_ENTITY, f.MODEL_SEGMENT_SET ]);
                    if (d[0]) void 0 !== d[1].addChild && d[1].addChild(this), this.parent = d[1]; else if (b > 0) throw new Error("Could not find a parent for this Container id : " + b);
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
                a.parent = null, a.children = [], a.matrix = new e(), a.name = "", a.pivot = new d();
            }, module.exports = g;
        }, {
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/awdString": 24,
            "../../src/types/matrix": 25,
            "../../src/types/vec3": 28
        } ],
        4: [ function(a, module, exports) {
            function b(a) {
                return a === h ? 28 : 27;
            }
            var c = a("../../src/BaseElement"), d = a("../../src/types/userAttr"), e = a("../../src/consts"), f = a("optx/extInfos"), g = a("optx/Container"), h = 0, i = c.createStruct(f.OPTX_ENV, f.URI, {
                init: function() {
                    this.model = e.MODEL_CONTAINER, g["super"](this), this.name = "", this.extras = new d(), 
                    this.shCoefs = null, this.brightness = 1, this.envMap = null;
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var c = a.U32(), d = a.U8(), f = b(d);
                    this.shCoefs = new Float32Array(f);
                    for (var g = 0; f > g; g++) this.shCoefs[g] = a.F32();
                    this.brightness = a.F32(), this.extras.read(a);
                    var h = this.awd.getAssetByID(c, [ e.MODEL_TEXTURE ]);
                    if (!h[0] && h > 0) throw new Error("Could not find EnvMap (ID = " + c + " ) for this Env");
                    c > 0 && (this.envMap = h[1]);
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
            g.extend(i.prototype), module.exports = i;
        }, {
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/userAttr": 27,
            "optx/Container": 3,
            "optx/extInfos": 14
        } ],
        5: [ function(a, module, exports) {
            function b() {
                this.data = null, this.mime = "application/octet-stream", this.uri = "";
            }
            var c = a("../../src/types/awdString");
            b.prototype.read = function(a) {
                this.mime = c.read(a), this.uri = c.read(a);
                var b = a.U32();
                this.data = a.subArray(b);
            }, module.exports = b;
        }, {
            "../../src/types/awdString": 24
        } ],
        6: [ function(a, module, exports) {
            function b() {
                this.data = null, this.attributes = [];
            }
            function c() {
                this.data = null, this.glType = 0, this.usage = 1;
            }
            function d() {
                this.name = "", this.numElems = 0, this.glType = 0, this.flags = 0;
            }
            function e(a) {
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
            var f = a("../../src/BaseElement"), g = a("../../src/types/userAttr"), h = a("../../src/types/awdString"), i = a("../../src/types/properties"), j = a("../../src/consts"), k = a("optx/extInfos"), l = f.createStruct(k.OPTX_GEOM, k.URI, {
                init: function() {
                    this.model = j.MODEL_GEOMETRY, this.name = "", this.extras = new g(), this.props = new i({}), 
                    this.vertexBuffers = [], this.indexBuffers = [];
                },
                read: function(a) {
                    this.name = h.read(a);
                    var d = a.U16(), e = a.U16(), f = this.props;
                    f.read(a);
                    var g, i, j = this.vertexBuffers, k = this.indexBuffers;
                    for (g = 0; d > g; g++) i = new b(), i.read(this.awd, a), j.push(i);
                    for (g = 0; e > g; g++) i = new c(), i.read(this.awd, a), k.push(i);
                    this.extras.read(a);
                },
                write: void 0,
                toString: function() {
                    return "[OptxGeometry " + this.name + "]";
                }
            });
            b.prototype = {
                read: function(a, b) {
                    for (var c = b.U32(), e = b.U16(), f = 0; e > f; f++) {
                        var g = new d();
                        g.read(b), this.attributes.push(g);
                    }
                    this.data = b.subArray(c);
                },
                write: void 0
            }, c.prototype = {
                read: function(a, b) {
                    var c = b.U32();
                    this.glType = b.U16(), this.usage = b.U8(), this.data = b.subArray(c);
                },
                write: function(a, b) {
                    b.U32(this.data.byteLength), b.U16(this.glType), b.U8(this.usage), b.writeSub(this.data);
                }
            }, c.TRIANGLE_USAGE = 1, c.WIREFRAME_USAGE = 2, d.FLAG_NORMALIZED = 2, d.prototype = {
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
                    return e(this.glType) * this.numElems;
                }
            }, l.types = {
                BYTE: 5120,
                UNSIGNED_BYTE: 5121,
                SHORT: 5122,
                UNSIGNED_SHORT: 5123,
                INT: 5124,
                UNSIGNED_INT: 5125,
                FLOAT: 5126
            }, l.VertexBuffer = b, l.IndexBuffer = c, l.VertexAttibute = d, l.getGLTypeBytesSize = e, 
            module.exports = l;
        }, {
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/awdString": 24,
            "../../src/types/properties": 26,
            "../../src/types/userAttr": 27,
            "optx/extInfos": 14
        } ],
        7: [ function(a, module, exports) {
            var b = a("../../src/BaseElement"), c = a("../../src/types/userAttr"), d = a("../../src/types/properties"), e = a("../../src/consts"), f = a("optx/extInfos"), g = a("optx/Container"), h = 1, i = 2, j = 3, k = 4, l = 5, m = 6, n = {};
            n[h] = e.AWD_FIELD_FLOAT32, n[i] = e.AWD_FIELD_FLOAT32, n[j] = e.AWD_FIELD_FLOAT32, 
            n[k] = e.AWD_FIELD_FLOAT32, n[l] = e.AWD_FIELD_FLOAT32, n[m] = e.AWD_FIELD_BOOL;
            var o = b.createStruct(f.OPTX_LIGHT, f.URI, {
                init: function() {
                    this.model = e.MODEL_LIGHT, g["super"](this), this.name = "", this.extras = new c(), 
                    this.shadow = !0, this.color = [ 1, 1, 1 ], this.radius = 50, this.falloffCurve = 2, 
                    this.spotAngle = 70, this.spotSharpness = 0;
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var b = new d(n);
                    b.read(a), this.readProps(b), this.extras.read(a);
                },
                write: void 0,
                setupProps: function(a) {
                    a.set(h, this.color), a.set(i, this.radius), a.set(j, this.falloffCurve), a.set(k, this.spotAngle), 
                    a.set(l, this.spotSharpness), a.set(m, this.shadow);
                },
                readProps: function(a) {
                    this.color = a.get(h, this.color), this.radius = a.get(i, this.radius), this.falloffCurve = a.get(j, this.falloffCurve), 
                    this.spotAngle = a.get(k, this.spotAngle), this.spotSharpness = a.get(l, this.spotSharpness), 
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
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/properties": 26,
            "../../src/types/userAttr": 27,
            "optx/Container": 3,
            "optx/extInfos": 14
        } ],
        8: [ function(a, module, exports) {
            var b = a("../../src/BaseElement"), c = a("../../src/types/userAttr"), d = a("../../src/types/awdString"), e = a("../../src/types/properties"), f = a("../../src/consts"), g = a("optx/extInfos"), h = 1, i = 2, j = 3, k = 4, l = 5, m = 6, n = 7, o = 8, p = 9, q = 10, r = 11, s = 12, t = 13, u = 14, v = 15, w = 16, x = 17, y = 18, z = 19, A = 20, B = 21, C = 22, D = {};
            D[h] = f.AWD_FIELD_STRING, D[i] = f.AWD_FIELD_FLOAT32, D[j] = f.AWD_FIELD_BOOL, 
            D[k] = f.AWD_FIELD_FLOAT32, D[l] = f.AWD_FIELD_FLOAT32, D[m] = f.AWD_FIELD_BOOL, 
            D[n] = f.AWD_FIELD_BOOL, D[o] = f.AWD_FIELD_BOOL, D[p] = f.AWD_FIELD_BOOL, D[q] = f.AWD_FIELD_FLOAT32, 
            D[r] = f.AWD_FIELD_FLOAT32, D[s] = f.AWD_FIELD_FLOAT32, D[t] = f.AWD_FIELD_BOOL, 
            D[u] = f.AWD_FIELD_FLOAT32, D[v] = f.AWD_FIELD_FLOAT32, D[w] = f.AWD_FIELD_FLOAT32, 
            D[x] = f.AWD_FIELD_FLOAT32, D[y] = f.AWD_FIELD_FLOAT32, D[z] = f.AWD_FIELD_FLOAT32, 
            D[A] = f.AWD_FIELD_FLOAT32, D[B] = f.AWD_FIELD_FLOAT32, D[C] = f.AWD_FIELD_BOOL;
            var E = b.createStruct(g.OPTX_MATERIAL, g.URI, {
                init: function() {
                    this.model = f.MODEL_MATERIAL, this.name = "", this.extras = new c(), this.textures = {
                        albedo: null,
                        reflectivity: null,
                        normal: null,
                        subsurface: null,
                        agt: null
                    }, this.colors = {
                        albedo: [ 0, 0, 0 ],
                        reflectivity: [ 0, 0, 0 ],
                        normal: [ 0, 0, 0 ],
                        subsurface: [ 0, 0, 0 ],
                        agt: [ 0, 0, 0 ]
                    }, this.blend = "none", this.alphaThreshold = 0, this.dithering = !1, this.fresnel = [ 1, 1, 1 ], 
                    this.horizonOcclude = 0, this.vertexColor = !1, this.vertexColorAlpha = !1, this.vertexColorSRGB = !1, 
                    this.aniso = !1, this.anisoStrength = 1, this.anisoIntegral = .5, this.anisoTangent = [ 1, 0, 0 ], 
                    this.subsurface = !1, this.subsurfaceColor = [ 1, 1, 1 ], this.transColor = [ 1, 0, 0, .5 ], 
                    this.fresnelColor = [ .2, .2, .2, .5 ], this.fresnelOcc = 1, this.fresnelGlossMask = 1, 
                    this.transSky = .5, this.shadowBlur = .5, this.normalSmooth = .5, this.unlit = !1;
                },
                read: function(a) {
                    this.name = d.read(a), this.textures.albedo = this.readTexture(a), this.textures.reflectivity = this.readTexture(a), 
                    this.textures.normal = this.readTexture(a), this.textures.subsurface = this.readTexture(a), 
                    this.textures.agt = this.readTexture(a), this.colors.albedo = [ a.F32(), a.F32(), a.F32() ], 
                    this.colors.reflectivity = [ a.F32(), a.F32(), a.F32() ], this.colors.normal = [ a.F32(), a.F32(), a.F32() ], 
                    this.colors.subsurface = [ a.F32(), a.F32(), a.F32() ], this.colors.agt = [ a.F32(), a.F32(), a.F32() ];
                    var b = new e(D);
                    b.read(a), this.readProps(b), this.extras.read(a);
                },
                writeColor: function(a, b) {
                    b.F32(a[0]), b.F32(a[1]), b.F32(a[2]);
                },
                write: void 0,
                readTexture: function(a) {
                    var b = a.U32();
                    if (b > 0) {
                        var c = this.awd.getAssetByID(b, [ f.MODEL_TEXTURE ]);
                        if (c[0]) return c[1];
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
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/awdString": 24,
            "../../src/types/properties": 26,
            "../../src/types/userAttr": 27,
            "optx/extInfos": 14
        } ],
        9: [ function(a, module, exports) {
            function b() {
                this.material = null, this.firstIndex = 0, this.indexCount = 0, this.firstWireIndex = 0, 
                this.wireIndexCount = 0;
            }
            var c = a("../../src/BaseElement"), d = a("../../src/types/userAttr"), e = a("../../src/types/properties"), f = a("../../src/consts"), g = a("optx/extInfos"), h = a("optx/Container"), i = {
                cullBackFaces: 1,
                castShadows: 2,
                bounds: 10
            }, j = c.createStruct(g.OPTX_MESH, g.URI, {
                init: function() {
                    this.model = f.MODEL_MESH, h["super"](this), this.geometry = null, this.extras = new d(), 
                    this.props = new e({
                        1: f.AWD_FIELD_BOOL,
                        2: f.AWD_FIELD_BOOL,
                        10: f.AWD_FIELD_FLOAT32
                    }), this.submeshes = [];
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var c = a.U32();
                    this.props.read(a);
                    for (var d = a.U16(), e = 0; d > e; e++) {
                        var g = new b();
                        g.read(this.awd, a), this.submeshes.push(g);
                    }
                    this.extras.read(a);
                    var h = this.awd.getAssetByID(c, [ f.MODEL_GEOMETRY ]);
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
            b.prototype = {
                read: function(a, b) {
                    var c = b.U32();
                    this.firstIndex = b.U32(), this.indexCount = b.U32(), this.firstWireIndex = b.U32(), 
                    this.wireIndexCount = b.U32();
                    var d = a.getAssetByID(c, [ f.MODEL_MATERIAL ]);
                    if (!d[0] && c > 0) throw new Error("Could not find Material (ID = " + c + " ) for this SubMesh");
                    c > 0 && (this.material = d[1]);
                },
                write: function(a, b) {
                    var c = 0, d = this.material;
                    d && (c = d.chunk.id), b.U32(c), b.U32(this.firstIndex), b.U32(this.indexCount), 
                    b.U32(this.firstWireIndex), b.U32(this.wireIndexCount);
                }
            }, h.extend(j.prototype), j.SubMesh = b, module.exports = j;
        }, {
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/properties": 26,
            "../../src/types/userAttr": 27,
            "optx/Container": 3,
            "optx/extInfos": 14
        } ],
        10: [ function(a, module, exports) {
            function b(a) {
                var b, k = a.U8();
                switch (k) {
                  case q:
                    b = new c();
                    break;

                  case r:
                    b = new e();
                    break;

                  case s:
                    b = new f();
                    break;

                  case t:
                    b = new g();
                    break;

                  case u:
                    b = new h();
                    break;

                  case v:
                    b = new d();
                    break;

                  case w:
                    b = new i();
                    break;

                  case x:
                    b = new j();
                    break;

                  default:
                    throw new Error("unknown post effect type " + k);
                }
                for (var l = 0; l < b._l; l++) b.props[l] = a.F32();
                return b;
            }
            function c(a, b) {
                this._l = 2, this._id = q, this.props = [ a, b ];
            }
            function d(a, b) {
                this._l = 2, this._id = v, this.props = [ a, b ];
            }
            function e(a, b) {
                this._l = 4, this._id = r, a = a || [ 1, 1, 1 ], this.props = [ a[0], a[1], a[2], b ];
            }
            function f(a, b) {
                this._l = 5, this._id = s, a = a || [ 1, 1, 1, 1 ], this.props = [ a[0], a[1], a[2], a[3], b ];
            }
            function g(a) {
                this._l = 3, this._id = t, a = a || [ 1, 1, 1 ], this.props = [ a[0], a[1], a[2] ];
            }
            function h(a, b, c) {
                this._l = 9, this._id = u, a = a || [ 1, 1, 1 ], b = b || [ 1, 1, 1 ], c = c || [ 1, 1, 1 ], 
                this.props = [ a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2] ];
            }
            function i() {
                this._l = 0, this._id = w, this.props = [];
            }
            function j() {
                this._l = 0, this._id = x, this.props = [];
            }
            var k = a("../../src/BaseElement"), l = a("../../src/types/userAttr"), m = a("../../src/types/awdString"), n = a("../../src/consts"), o = a("optx/extInfos"), p = k.createStruct(o.OPTX_POST, o.URI, {
                init: function() {
                    this.model = n.MODEL_GENERIC, this.name = "", this.effects = [], this.extras = new l();
                },
                read: function(a) {
                    this.name = m.read(a), this.effects = [];
                    for (var c = a.U8(), d = 0; c > d; d++) this.effects.push(b(a));
                    this.extras.read(a);
                },
                write: void 0,
                getDependencies: function() {
                    return null;
                },
                toString: function() {
                    return "[Post " + this.name + "]";
                }
            }), q = 1, r = 2, s = 3, t = 4, u = 5, v = 6, w = 7, x = 8;
            c.prototype = {
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
            }, d.prototype = {
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
            }, e.prototype = {
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
            }, f.prototype = {
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
            }, g.prototype = {
                getRgb: function() {
                    return this.props;
                },
                setRgb: function(a) {
                    this.props = a;
                }
            }, h.prototype = {
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
            }, i.prototype = {}, j.prototype = {}, p.Sharpen = c, p.Bloom = e, p.Vignette = f, 
            p.Saturation = g, p.Contrast = h, p.Grain = d, p.Reinhard = i, p.Hejl = j, module.exports = p;
        }, {
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/awdString": 24,
            "../../src/types/userAttr": 27,
            "optx/extInfos": 14
        } ],
        11: [ function(a, module, exports) {
            var b = a("../../src/BaseElement"), c = a("../../src/types/userAttr"), d = a("../../src/consts"), e = a("optx/extInfos"), f = a("optx/Container"), g = 0, h = 1, i = b.createStruct(e.OPTX_SKY, e.URI, {
                init: function() {
                    this.model = d.MODEL_CONTAINER, f["super"](this), this.name = "", this.extras = new c(), 
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
                    var b = a.U32();
                    this.skyType = a.U8(), this.brightness = a.F32(), this.extras.read(a);
                    var c = this.awd.getAssetByID(b, [ d.MODEL_CONTAINER ]);
                    if (!c[0] && c > 0) throw new Error("Could not find env (ID = " + b + " ) for this Sky");
                    b > 0 && (this.env = c[1]);
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
            i.SKY_TYPE_SH = g, i.SKY_TYPE_ENV = h, f.extend(i.prototype), module.exports = i;
        }, {
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/userAttr": 27,
            "optx/Container": 3,
            "optx/extInfos": 14
        } ],
        12: [ function(a, module, exports) {
            var b = a("../../src/BaseElement"), c = a("../../src/types/userAttr"), d = a("../../src/types/awdString"), e = a("../../src/types/properties"), f = a("../../src/consts"), g = a("optx/extInfos"), h = a("optx/FileData"), i = 1, j = 2, k = 3, l = 4, m = 5, n = {};
            n[i] = f.AWD_FIELD_UINT32, n[j] = f.AWD_FIELD_UINT32, n[k] = f.AWD_FIELD_UINT32, 
            n[l] = f.AWD_FIELD_UINT32, n[m] = f.AWD_FIELD_UINT32;
            var o = b.createStruct(g.OPTX_TEXTURE, g.URI, {
                init: function() {
                    this.model = f.MODEL_TEXTURE, this.name = "", this.extras = new c(), this.fileData = null, 
                    this.uri = null, this.infos = {};
                },
                read: function(a) {
                    this.name = d.read(a);
                    var b = a.U8(), c = !!(1 & b);
                    c ? (this.fileData = new h(), this.fileData.read(a)) : this.uri = d.read(a);
                    var f = new e(n);
                    f.read(a), this.readProps(f), this.extras.read(a);
                },
                write: void 0,
                setupProps: void 0,
                readProps: function(a) {
                    var b = this.infos;
                    b.width = a.get(i, b.width), b.height = a.get(j, b.height), b.glinternalFormat = a.get(k, b.glinternalFormat), 
                    b.glformat = a.get(l, b.glformat), b.gltype = a.get(m, b.gltype);
                },
                getDependencies: function() {
                    return null;
                },
                toString: function() {
                    return "[Texture " + this.name + "]";
                }
            });
            module.exports = o;
        }, {
            "../../src/BaseElement": 16,
            "../../src/consts": 22,
            "../../src/types/awdString": 24,
            "../../src/types/properties": 26,
            "../../src/types/userAttr": 27,
            "optx/FileData": 5,
            "optx/extInfos": 14
        } ],
        13: [ function(a, module, exports) {
            var b = a("../../src/extension"), c = a("optx/Geometry"), d = a("optx/Mesh"), e = a("optx/Material"), f = a("optx/Texture"), g = a("optx/CompositeTexture"), h = a("optx/Light"), i = a("optx/Env"), j = a("optx/Sky"), k = a("optx/Camera"), l = a("optx/Post"), m = a("optx/extInfos"), n = [ c, d, e, f, g, h, i, j, k, l ], o = m;
            o.getExtension = function() {
                var a = new b(m.URI);
                return a.addStructs(n), a;
            }, module.exports = o;
        }, {
            "../../src/extension": 23,
            "optx/Camera": 1,
            "optx/CompositeTexture": 2,
            "optx/Env": 4,
            "optx/Geometry": 6,
            "optx/Light": 7,
            "optx/Material": 8,
            "optx/Mesh": 9,
            "optx/Post": 10,
            "optx/Sky": 11,
            "optx/Texture": 12,
            "optx/extInfos": 14
        } ],
        14: [ function(a, module, exports) {
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
        15: [ function(a, module, exports) {
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
        16: [ function(a, module, exports) {
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
            "./chunk": 21,
            "./consts": 22
        } ],
        17: [ function(a, module, exports) {
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
            "./BaseElement": 16,
            "./consts": 22
        } ],
        18: [ function(a, module, exports) {
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
            "./BaseElement": 16,
            "./consts": 22,
            "./types/awdString": 24
        } ],
        19: [ function(a, module, exports) {
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
        20: [ function(a, module, exports) {
            module.exports = {};
        }, {
            "string.prototype.codepointat": 15
        } ],
        21: [ function(a, module, exports) {
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
        22: [ function(a, module, exports) {
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
        23: [ function(a, module, exports) {
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
            "./DefaultElement": 17,
            "./Namespace": 18
        } ],
        24: [ function(a, module, exports) {
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
        25: [ function(a, module, exports) {
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
        26: [ function(a, module, exports) {
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
            "../bufferReader": 19,
            "../bufferWriter": 20,
            "../consts": 22,
            "./awdString": 24
        } ],
        27: [ function(a, module, exports) {
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
            "../bufferReader": 19,
            "../bufferWriter": 20,
            "../consts": 22,
            "./awdString": 24
        } ],
        28: [ function(a, module, exports) {
            !function() {
                var b = a("../consts"), c = a("./properties"), d = function(a, b, c) {
                    this.x = a || 0, this.y = b || 0, this.z = c || 0;
                };
                d.prototype = {
                    parsePivot: function(a, d) {
                        var e = a.header.matrixNrType, f = new c({
                            1: e,
                            2: e,
                            3: e,
                            4: b.UINT8
                        });
                        f.read(d), this.x = f.get(1, 0), this.y = f.get(2, 0), this.z = f.get(3, 0);
                    },
                    writePivot: void 0
                }, module.exports = d;
            }();
        }, {
            "../consts": 22,
            "./properties": 26
        } ],
        awdlib_optx: [ function(a, module, exports) {
            module.exports = {
                Camera: a("optx/Camera"),
                CompositeTexture: a("optx/CompositeTexture"),
                Container: a("optx/Container"),
                Env: a("optx/Env"),
                Geometry: a("optx/Geometry"),
                Light: a("optx/Light"),
                Material: a("optx/Material"),
                Mesh: a("optx/Mesh"),
                Post: a("optx/Post"),
                Sky: a("optx/Sky"),
                Texture: a("optx/Texture"),
                FileData: a("optx/FileData"),
                ext: a("optx/ext"),
                extInfos: a("optx/extInfos")
            };
        }, {
            "optx/Camera": 1,
            "optx/CompositeTexture": 2,
            "optx/Container": 3,
            "optx/Env": 4,
            "optx/FileData": 5,
            "optx/Geometry": 6,
            "optx/Light": 7,
            "optx/Material": 8,
            "optx/Mesh": 9,
            "optx/Post": 10,
            "optx/Sky": 11,
            "optx/Texture": 12,
            "optx/ext": 13,
            "optx/extInfos": 14
        } ]
    }, {}, [])("awdlib_optx");
});