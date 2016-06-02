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
                write: function(a) {
                    this.writeNodeCommon(a);
                    var b = 0;
                    this.post && (b = this.post.chunk.id), a.U32(b), a.U8(this.lensType), a.F32(this.near), 
                    a.F32(this.far), this.lensType === g ? a.F32(this.fov) : this.lensType === h && (a.F32(this.minX), 
                    a.F32(this.maxX), a.F32(this.minY), a.F32(this.maxY)), this.extras.write(a);
                },
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
                return b = d === c ? e === c ? f === c ? i[f] : i[f] + i[e] : i[f] + i[e] + i[d] : i[f] + i[e] + i[d] + i[c];
            }
            function c(a) {
                for (var b = a.split(""); b.length > 1 && b[b.length - 1] === b[b.length - 2]; ) b.pop();
                for (var c, d = 0, e = 0; e < b.length; e++) c = j[b[e]], d |= c << 2 * e;
                for (;4 > e; e++) d |= c << 2 * e;
                return d;
            }
            var d = a("../../src/BaseElement"), e = a("../../src/types/userAttr"), f = a("../../src/types/awdString"), g = a("../../src/consts"), h = a("optx/extInfos"), i = [ "r", "g", "b", "a" ], j = {
                r: 0,
                g: 1,
                b: 2,
                a: 3
            }, k = d.createStruct(h.OPTX_COMPOSITE_TEXTURE, h.URI, {
                init: function() {
                    this.model = g.MODEL_TEXTURE, this.name = "", this.extras = new e(), this.components = null;
                },
                resolveTexture: function(a) {
                    var b = this.awd.getAssetByID(a, [ g.MODEL_TEXTURE ]);
                    if (b[0]) return b[1];
                    throw new Error("Could not find referenced Texture for this CompositeTexture, uid : " + a);
                },
                read: function(a) {
                    this.name = f.read(a);
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
                write: function(a) {
                    f.write(this.name, a), this.assertValid();
                    var b = this.components.length;
                    a.U8(b);
                    for (var d = 0; b > d; d++) {
                        var e = this.components[d];
                        a.U8(c(e.out)), a.U8(c(e.comps)), a.U32(e.tex.chunk.id);
                    }
                    this.extras.write(a);
                },
                getDependencies: function() {
                    return this.assertValid(), this.components.map(function(a) {
                        return a.tex;
                    });
                },
                toString: function() {
                    return "[CompositeTexture " + this.name + "]";
                }
            });
            module.exports = k;
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
                writeNodeCommon: function(a) {
                    var b = 0, d = this.parent;
                    d && (b = d.chunk.id), a.U32(b), this.matrix.write(this.awd, a), this.pivot.writePivot(this.awd, a), 
                    c.write(this.name, a);
                },
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
                return a === i ? 28 : 27;
            }
            function c(a) {
                if (28 === a) return i;
                if (27 === a) return j;
                throw new Error("optx::Env : invalid shCoefs size : ", a);
            }
            var d = a("../../src/BaseElement"), e = a("../../src/types/userAttr"), f = a("../../src/consts"), g = a("optx/extInfos"), h = a("optx/Container"), i = 0, j = 1, k = d.createStruct(g.OPTX_ENV, g.URI, {
                init: function() {
                    this.model = f.MODEL_CONTAINER, h["super"](this), this.name = "", this.extras = new e(), 
                    this.shCoefs = null, this.brightness = 1, this.envMap = null;
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var c = a.U32(), d = a.U8(), e = b(d);
                    this.shCoefs = new Float32Array(e);
                    for (var g = 0; e > g; g++) this.shCoefs[g] = a.F32();
                    this.brightness = a.F32(), this.extras.read(a);
                    var h = this.awd.getAssetByID(c, [ f.MODEL_TEXTURE ]);
                    if (!h[0] && h > 0) throw new Error("Could not find EnvMap (ID = " + c + " ) for this Env");
                    c > 0 && (this.envMap = h[1]);
                },
                write: function(a) {
                    if (!this.envMap) throw new Error("Env have no envMap");
                    var b = this.envMap.chunk.id;
                    if (this.writeNodeCommon(a), a.U32(b), !this.shCoefs) throw new Error("Env have no sh");
                    a.U8(c(this.shCoefs.length));
                    for (var d = 0; d < this.shCoefs.length; d++) a.F32(this.shCoefs[d]);
                    a.F32(this.brightness), this.extras.write(a);
                },
                getDependencies: function() {
                    var a = this.getGraphDependencies();
                    return this.envMap && a.push(this.envMap), a;
                },
                toString: function() {
                    return "[Env " + this.name + "]";
                }
            });
            h.extend(k.prototype), module.exports = k;
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
            }, b.prototype.write = function(a) {
                c.write(this.mime, a), c.write(this.uri, a), a.U32(this.data.length), a.writeSub(this.data);
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
                write: function(a) {
                    h.write(this.name, a), a.U16(this.vertexBuffers.length), a.U16(this.indexBuffers.length);
                    var b = this.props;
                    b.write(a);
                    var c, d = this.vertexBuffers, e = this.indexBuffers;
                    for (c = 0; c < d.length; c++) d[c].write(this.awd, a);
                    for (c = 0; c < e.length; c++) e[c].write(this.awd, a);
                    this.extras.write(a);
                },
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
                write: function(a, b) {
                    b.U32(this.data.length), b.U16(this.attributes.length);
                    for (var c = 0; c < this.attributes.length; c++) this.attributes[c].write(b);
                    b.writeSub(this.data);
                }
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
                write: function(a) {
                    this.writeNodeCommon(a);
                    var b = new d(n);
                    this.setupProps(b), b.write(a), this.extras.write(a);
                },
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
                write: function(a) {
                    d.write(this.name, a), this.writeTexture(this.textures.albedo, a), this.writeTexture(this.textures.reflectivity, a), 
                    this.writeTexture(this.textures.normal, a), this.writeTexture(this.textures.subsurface, a), 
                    this.writeTexture(this.textures.agt, a), this.writeColor(this.colors.albedo, a), 
                    this.writeColor(this.colors.reflectivity, a), this.writeColor(this.colors.normal, a), 
                    this.writeColor(this.colors.subsurface, a), this.writeColor(this.colors.agt, a);
                    var b = new e(D);
                    this.setupProps(b), b.write(a), this.extras.write(a);
                },
                readTexture: function(a) {
                    var b = a.U32();
                    if (b > 0) {
                        var c = this.awd.getAssetByID(b, [ f.MODEL_TEXTURE ]);
                        if (c[0]) return c[1];
                        throw new Error("Could not find Texture for this Material, uid : " + b);
                    }
                    return null;
                },
                writeTexture: function(a, b) {
                    a ? b.U32(a.chunk.id) : b.U32(0);
                },
                setupProps: function(a) {
                    a.set(h, this.blend), a.set(i, this.alphaThreshold), a.set(j, this.dithering), a.set(k, this.fresnel), 
                    a.set(l, this.horizonOcclude), this.vertexColor && (a.set(m, this.vertexColor), 
                    a.set(n, this.vertexColorAlpha), a.set(o, this.vertexColorSRGB), a.set(p, this.aniso)), 
                    this.aniso && (a.set(q, this.anisoStrength), a.set(r, this.anisoIntegral), a.set(s, this.anisoTangent), 
                    a.set(t, this.subsurface)), this.subsurface && (a.set(u, this.subsurfaceColor), 
                    a.set(v, this.transColor), a.set(w, this.fresnelColor), a.set(x, this.fresnelOcc), 
                    a.set(y, this.fresnelGlossMask), a.set(z, this.transSky), a.set(A, this.shadowBlur), 
                    a.set(B, this.normalSmooth)), a.set(C, this.unlit);
                },
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
                getDependencies: function() {
                    var a = [], b = this.textures;
                    return b.albedo && a.push(b.albedo), b.reflectivity && a.push(b.reflectivity), b.agt && a.push(b.agt), 
                    b.normal && a.push(b.normal), b.subsurface && a.push(b.subsurface), a;
                },
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
                write: function(a) {
                    var b = 0, c = this.geometry;
                    c && (b = c.chunk.id), this.writeNodeCommon(a), a.U32(b), this.props.write(a);
                    var d = this.submeshes.length;
                    a.U16(d);
                    for (var e = 0; d > e; e++) {
                        var f = this.submeshes[e];
                        f.write(this.awd, a);
                    }
                    this.extras.write(a);
                },
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
                var b, c = a.U8();
                switch (c) {
                  case r:
                    b = new d();
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
                    b = new i();
                    break;

                  case w:
                    b = new e();
                    break;

                  case x:
                    b = new j();
                    break;

                  case y:
                    b = new k();
                    break;

                  default:
                    throw new Error("unknown post effect type " + c);
                }
                for (var l = 0; l < b._l; l++) b.props[l] = a.F32();
                return b;
            }
            function c(a, b) {
                b.U8(a._id);
                for (var c = 0; c < a._l; c++) b.F32(a.props[c]);
            }
            function d(a, b) {
                this._l = 2, this._id = r, this.props = [ a, b ];
            }
            function e(a, b) {
                this._l = 2, this._id = w, this.props = [ a, b ];
            }
            function f(a, b) {
                this._l = 4, this._id = s, a = a || [ 1, 1, 1 ], this.props = [ a[0], a[1], a[2], b ];
            }
            function g(a, b) {
                this._l = 5, this._id = t, a = a || [ 1, 1, 1, 1 ], this.props = [ a[0], a[1], a[2], a[3], b ];
            }
            function h(a) {
                this._l = 3, this._id = u, a = a || [ 1, 1, 1 ], this.props = [ a[0], a[1], a[2] ];
            }
            function i(a, b, c) {
                this._l = 9, this._id = v, a = a || [ 1, 1, 1 ], b = b || [ 1, 1, 1 ], c = c || [ 1, 1, 1 ], 
                this.props = [ a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2] ];
            }
            function j() {
                this._l = 0, this._id = x, this.props = [];
            }
            function k() {
                this._l = 0, this._id = y, this.props = [];
            }
            var l = a("../../src/BaseElement"), m = a("../../src/types/userAttr"), n = a("../../src/types/awdString"), o = a("../../src/consts"), p = a("optx/extInfos"), q = l.createStruct(p.OPTX_POST, p.URI, {
                init: function() {
                    this.model = o.MODEL_GENERIC, this.name = "", this.effects = [], this.extras = new m();
                },
                read: function(a) {
                    this.name = n.read(a), this.effects = [];
                    for (var c = a.U8(), d = 0; c > d; d++) this.effects.push(b(a));
                    this.extras.read(a);
                },
                write: function(a) {
                    n.write(this.name, a);
                    var b = this.effects.length;
                    a.U8(b);
                    for (var d = 0; b > d; d++) c(this.effects[d], a);
                    this.extras.write(a);
                },
                getDependencies: function() {
                    return null;
                },
                toString: function() {
                    return "[Post " + this.name + "]";
                }
            }), r = 1, s = 2, t = 3, u = 4, v = 5, w = 6, x = 7, y = 8;
            d.prototype = {
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
            }, e.prototype = {
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
            }, f.prototype = {
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
            }, g.prototype = {
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
            }, h.prototype = {
                getRgb: function() {
                    return this.props;
                },
                setRgb: function(a) {
                    this.props = a;
                }
            }, i.prototype = {
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
            }, j.prototype = {}, k.prototype = {}, q.Sharpen = d, q.Bloom = f, q.Vignette = g, 
            q.Saturation = h, q.Contrast = i, q.Grain = e, q.Reinhard = j, q.Hejl = k, module.exports = q;
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
                write: function(a) {
                    if (!this.env) throw new Error("Sky have no env");
                    var b = this.env.chunk.id;
                    this.writeNodeCommon(a), a.U32(b), a.U8(this.skyType), a.F32(this.brightness), this.extras.write(a);
                },
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
                write: function(a) {
                    d.write(this.name, a);
                    var b = null !== this.fileData, c = +b;
                    if (a.U8(c), b) this.fileData.write(a); else {
                        if (null === this.uri) throw new Error("Texture have no embedData nor uri");
                        d.write(this.uri, a);
                    }
                    var f = new e(n);
                    this.setupProps(f), f.write(a), this.extras.write(a);
                },
                setupProps: function(a) {
                    var b = this.infos;
                    a.set(i, b.width), a.set(j, b.height), a.set(k, b.glinternalFormat), a.set(l, b.glformat), 
                    a.set(m, b.gltype);
                },
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
                prepareAndAdd: function(a, b) {
                    if (!(b.indexOf(this) > -1)) {
                        this.awd = a;
                        for (var c = this.deps, d = 0, e = c.length; e > d; d++) c[d].prepareAndAdd(a, b);
                        this.id = b.length + 1, this.prepareChunk(), this.chunk.id = this.id, b.push(this);
                    }
                },
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
                    write: function(a) {
                        a.U8(this.nsId), b.write(this.uri, a);
                    }
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
                        128 > b ? f[g++] = String.fromCharCode(b) : b > 191 && 224 > b ? (c = this.U8(), 
                        f[g++] = String.fromCharCode((31 & b) << 6 | 63 & c)) : (c = this.U8(), d = this.U8(), 
                        f[g++] = String.fromCharCode((15 & b) << 12 | (63 & c) << 6 | 63 & d));
                        return f.join("");
                    }
                }, module.exports = a;
            }();
        }, {} ],
        20: [ function(a, module, exports) {
            a("string.prototype.codepointat");
            var b = 65536, c = function() {
                for (var a = [], b = 0; 5 > b; b++) a[b] = parseInt("1111".slice(0, b), 2);
                return a;
            }(), d = function(a) {
                this.buffer = new ArrayBuffer(a), this.ptr = 0, this.littleEndien = !0, this.view = new DataView(this.buffer), 
                this.length = this.view.byteLength, this.skips = [];
            };
            d.prototype = {
                _ensureSize: function(a) {
                    this.ptr + a > this.buffer.byteLength && this._realloc(this.ptr + a);
                },
                _realloc: function(a) {
                    for (var c = this.buffer.byteLength, d = b; a > c + d; ) d += b;
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
                    for (var b = 0, d = a.length; d > b; b++) {
                        var e, f = a[b].codePointAt(0);
                        if (128 > f ? e = 1 : 2048 > f ? e = 2 : 65536 > f ? e = 3 : 2097152 > f && (e = 4), 
                        1 === e) this.U8(f); else for (this.U8((c[e] << 8 - e) + (f >>> 6 * --e)); e > 0; ) this.U8(f >>> 6 * --e & 63 | 128);
                    }
                }
            }, module.exports = d;
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
                    write: function(a) {
                        a.U32(this.id), a.U8(this.ns), a.U8(this.type), a.U8(this.flags);
                    }
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
        26: [ function(a, module, exports) {
            !function() {
                var b = a("../consts"), c = a("./awdString"), d = a("../bufferWriter"), e = a("../bufferReader"), f = function(a) {
                    this.expected = a, this.vars = {};
                };
                f.prototype = {
                    clone: function() {
                        var a = new d(64);
                        this.write(a);
                        var b = new f(this.expected);
                        return b.read(new e(a.buffer)), b;
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
                    writeAttrValue: function(a, d, e) {
                        var f, g;
                        switch (a) {
                          case b.AWD_FIELD_INT8:
                            f = 1, g = e.I8;
                            break;

                          case b.AWD_FIELD_INT16:
                            f = 2, g = e.I16;
                            break;

                          case b.AWD_FIELD_INT32:
                            f = 4, g = e.I32;
                            break;

                          case b.AWD_FIELD_BOOL:
                          case b.AWD_FIELD_UINT8:
                            f = 1, g = e.U8;
                            break;

                          case b.AWD_FIELD_UINT16:
                            f = 2, g = e.U16;
                            break;

                          case b.AWD_FIELD_UINT32:
                          case b.AWD_FIELD_BADDR:
                            f = 4, g = e.U32;
                            break;

                          case b.AWD_FIELD_FLOAT32:
                            f = 4, g = e.F32;
                            break;

                          case b.AWD_FIELD_FLOAT64:
                            f = 8, g = e.F64;
                            break;

                          case b.AWD_FIELD_STRING:
                            return e.U32(c.getUTFBytesLength(d)), void e.writeUTFBytes(d);

                          case b.AWD_FIELD_VECTOR2x1:
                          case b.AWD_FIELD_VECTOR3x1:
                          case b.AWD_FIELD_VECTOR4x1:
                          case b.AWD_FIELD_MTX3x2:
                          case b.AWD_FIELD_MTX3x3:
                          case b.AWD_FIELD_MTX4x3:
                          case b.AWD_FIELD_MTX4x4:
                            f = 8, g = e.F64;
                        }
                        if (d instanceof Array) {
                            e.U32(d.length * f);
                            for (var h = 0, i = d.length; i > h; h++) g.call(e, d[h]);
                        } else e.U32(f), g.call(e, d);
                    },
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
                }, module.exports = f;
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
                    write: function(a) {
                        for (var d = a.skipBlockSize(), e = 0, f = this._list.length; f > e; e++) {
                            var g, h = this._list[e], i = h.ns, j = h.name, k = h.type, l = h.value;
                            switch (a.U8(i), c.write(j, a), a.U8(k), k) {
                              case b.AWDSTRING:
                                g = c.getUTFBytesLength(l), a.U32(g), a.writeUTFBytes(l);
                                break;

                              case b.INT8:
                                a.U32(1), a.I8(l);
                                break;

                              case b.INT16:
                                a.U32(2), a.I16(l);
                                break;

                              case b.INT32:
                                a.U32(4), a.I32(l);
                                break;

                              case b.BOOL:
                              case b.UINT8:
                                a.U32(1), a.U8(l);
                                break;

                              case b.UINT16:
                                a.U32(2), a.U16(l);
                                break;

                              case b.UINT32:
                              case b.BADDR:
                                a.U32(4), a.U32(l);
                                break;

                              case b.FLOAT32:
                                a.U32(4), a.F32(l);
                                break;

                              case b.FLOAT64:
                                a.U32(8), a.F64(l);
                                break;

                              default:
                                throw new Error("UserAttribute unsupported type");
                            }
                        }
                        a.writeBlockSize(d);
                    }
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
                    writePivot: function(a, d) {
                        var e = a.header.matrixNrType, f = new c({
                            1: e,
                            2: e,
                            3: e,
                            4: b.UINT8
                        });
                        f.set(1, this.x), f.set(2, this.y), f.set(3, this.z), f.write(d);
                    }
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