!function(a) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = a(); else if ("function" == typeof define && define.amd) define([], a); else {
        var b;
        b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, 
        b.awdlib_optx = a();
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
            var a = require("libawd"), b = a.consts, c = a.BaseElement, d = a.userAttr, e = require("optx/extInfos"), f = require("optx/Container"), g = 0, h = 1, i = c.createStruct(e.OPTX_CAMERA, e.URI, {
                init: function() {
                    this.model = b.MODEL_CAMERA, f["super"](this), this.name = "", this.extras = new d(), 
                    this.lensType = g, this.near = .1, this.far = 1e3, this.fov = 60, this.minX = -20, 
                    this.maxX = 20, this.minY = -20, this.maxY = 20;
                },
                makePerspective: function(a, b, c) {
                    this.lensType = g, this.fov = a, this.near = b, this.far = c;
                },
                makeOrtho: function(a, b, c, d, e, f) {
                    this.lensType = h, this.minX = a, this.maxX = b, this.minY = c, this.maxY = d, this.near = e, 
                    this.far = f;
                },
                read: function(a) {
                    this.readNodeCommon(a), this.lensType = a.U8(), this.near = a.F32(), this.far = a.F32(), 
                    this.lensType === g ? this.fov = a.F32() : this.lensType === h && (this.minX = a.F32(), 
                    this.maxX = a.F32(), this.minY = a.F32(), this.maxY = a.F32()), this.extras.read(a);
                },
                write: function(a) {
                    this.writeNodeCommon(a), a.U8(this.lensType), a.F32(this.near), a.F32(this.far), 
                    this.lensType === g ? a.F32(this.fov) : this.lensType === h && (a.F32(this.minX), 
                    a.F32(this.maxX), a.F32(this.minY), a.F32(this.maxY)), this.extras.write(a);
                },
                getDependencies: function() {
                    return this.getGraphDependencies();
                },
                toString: function() {
                    return "[Camera " + this.name + "]";
                }
            });
            f.extend(i.prototype), module.exports = i;
        }, {
            libawd: 13,
            "optx/Container": 3,
            "optx/extInfos": 12
        } ],
        2: [ function(require, module, exports) {
            function a(a) {
                var b, c = 3 & a >>> 6, d = 3 & a >>> 4, e = 3 & a >>> 2, f = 3 & a;
                return b = d === c ? e === c ? f === c ? i[f] : i[f] + i[e] : i[f] + i[e] + i[d] : i[f] + i[e] + i[d] + i[c];
            }
            function b(a) {
                for (var b = a.split(""); b.length > 1 && b[b.length - 1] === b[b.length - 2]; ) b.pop();
                for (var c, d = 0, e = 0; e < b.length; e++) c = j[b[e]], d |= c << 2 * e;
                for (;4 > e; e++) d |= c << 2 * e;
                return d;
            }
            var c = require("libawd"), d = c.awdString, e = c.consts, f = c.BaseElement, g = c.userAttr, h = require("optx/extInfos"), i = [ "r", "g", "b", "a" ], j = {
                r: 0,
                g: 1,
                b: 2,
                a: 3
            }, k = f.createStruct(h.OPTX_COMPOSITE_TEXTURE, h.URI, {
                init: function() {
                    this.model = e.MODEL_TEXTURE, this.name = "", this.extras = new g(), this.components = null;
                },
                resolveTexture: function(a) {
                    var b = this.awd.getAssetByID(a, [ e.MODEL_TEXTURE ]);
                    if (b[0]) return b[1];
                    throw new Error("Could not find referenced Texture for this CompositeTexture, uid : " + a);
                },
                read: function(b) {
                    this.name = d.read(b);
                    var c = b.U8();
                    this.components = [];
                    for (var e = 0; c > e; e++) this.components.push({
                        out: a(b.U8()),
                        comps: a(b.U8()),
                        tex: this.resolveTexture(b.U32())
                    });
                    this.extras.read(b);
                },
                assertValid: function() {
                    if (null == this.components) throw new Error("CompositeTexture.write -  components are not defined");
                },
                write: function(a) {
                    d.write(this.name, a), this.assertValid();
                    var c = this.components.length;
                    a.U8(c);
                    for (var e = 0; c > e; e++) {
                        var f = this.components[e];
                        a.U8(b(f.out)), a.U8(b(f.comps)), a.U32(f.tex.chunk.id);
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
            libawd: 13,
            "optx/extInfos": 12
        } ],
        3: [ function(require, module, exports) {
            var a = require("libawd"), b = a.awdString, c = a.consts, d = a.BaseElement, e = a.vec3, f = a.matrix, g = d.createStruct(-1, null, {
                init: function() {
                    this.model = c.MODEL_CONTAINER, g["super"](this);
                },
                readNodeCommon: function(a) {
                    var d = a.U32();
                    this.matrix.read(this.awd, a), this.pivot.parsePivot(this.awd, a), this.name = b.read(a);
                    var e = this.awd.getAssetByID(d, [ c.MODEL_CONTAINER, c.MODEL_MESH, c.MODEL_LIGHT, c.MODEL_ENTITY, c.MODEL_SEGMENT_SET ]);
                    if (e[0]) void 0 !== e[1].addChild && e[1].addChild(this), this.parent = e[1]; else if (d > 0) throw new Error("Could not find a parent for this Container id : " + d);
                },
                writeNodeCommon: function(a) {
                    var c = 0, d = this.parent;
                    d && (c = d.chunk.id), a.U32(c), this.matrix.write(this.awd, a), this.pivot.writePivot(this.awd, a), 
                    b.write(this.name, a);
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
                a.parent = null, a.children = [], a.matrix = new f(), a.name = "", a.pivot = new e();
            }, module.exports = g;
        }, {
            libawd: 13
        } ],
        4: [ function(require, module, exports) {
            function a(a) {
                return a === p ? 28 : 27;
            }
            function b(a) {
                return 28 === a ? p : q;
            }
            var c = require("libawd"), d = c.consts, e = c.BaseElement, f = c.userAttr, g = require("optx/extInfos"), h = require("optx/Container"), i = 1, j = 2, k = 3, l = 4, m = 5, n = 6, o = {};
            o[i] = d.AWD_FIELD_FLOAT32, o[j] = d.AWD_FIELD_FLOAT32, o[k] = d.AWD_FIELD_FLOAT32, 
            o[l] = d.AWD_FIELD_FLOAT32, o[m] = d.AWD_FIELD_FLOAT32, o[n] = d.AWD_FIELD_BOOL;
            var p = 0, q = 1, r = e.createStruct(g.OPTX_ENV, g.URI, {
                init: function() {
                    this.model = d.MODEL_CONTAINER, h["super"](this), this.name = "", this.extras = new f(), 
                    this.shCoefs = null, this.brightness = 1, this.envMap = null;
                },
                read: function(b) {
                    this.readNodeCommon(b);
                    var c = b.U32(), e = b.U8(), f = a(e);
                    this.shCoefs = new Float32Array(f);
                    for (var g = 0; f > g; g++) this.shCoefs[g] = b.F32();
                    this.brightness = b.F32(), this.extras.read(b);
                    var h = this.awd.getAssetByID(c, [ d.MODEL_TEXTURE ]);
                    if (!h[0] && h > 0) throw new Error("Could not find EnvMap (ID = " + c + " ) for this Env");
                    c > 0 && (this.envMap = h[1]);
                },
                write: function(a) {
                    if (!this.envMap) throw new Error("Env have no envMap");
                    var c = this.envMap.chunk.id;
                    if (this.writeNodeCommon(a), a.U32(c), !this.shCoefs) throw new Error("Env have no sh");
                    a.U8(b(this.shCoefs.length));
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
            h.extend(r.prototype), module.exports = r;
        }, {
            libawd: 13,
            "optx/Container": 3,
            "optx/extInfos": 12
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
            var e = require("libawd"), f = e.BaseElement, g = e.consts, h = e.awdString, i = e.userAttr, j = e.properties, k = require("optx/extInfos"), l = f.createStruct(k.OPTX_GEOM, k.URI, {
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
            libawd: 13,
            "optx/extInfos": 12
        } ],
        6: [ function(require, module, exports) {
            var a = require("libawd"), b = a.consts, c = a.BaseElement, d = a.userAttr, e = a.properties, f = require("optx/extInfos"), g = require("optx/Container"), h = 1, i = 2, j = 3, k = 4, l = 5, m = 6, n = {};
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
                write: function(a) {
                    this.writeNodeCommon(a);
                    var b = new e(n);
                    this.setupProps(b), b.write(a), this.extras.write(a);
                },
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
            libawd: 13,
            "optx/Container": 3,
            "optx/extInfos": 12
        } ],
        7: [ function(require, module, exports) {
            var a = require("libawd"), b = a.awdString, c = a.consts, d = a.BaseElement, e = a.userAttr, f = a.properties, g = require("optx/extInfos"), h = 1, i = 2, j = 3, k = 4, l = 5, m = 6, n = 7, o = 8, p = 9, q = 10, r = 11, s = 12, t = 13, u = 14, v = 15, w = 16, x = 17, y = 18, z = 19, A = 20, B = 21, C = 22, D = {};
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
                        alpha: null,
                        reflectivity: null,
                        gloss: null,
                        normal: null,
                        subsurface: null
                    }, this.colors = {
                        albedo: 4278190080,
                        alpha: 4278190080,
                        reflectivity: 4278190080,
                        gloss: 4278190080,
                        normal: 4278190080,
                        subsurface: 4278190080
                    }, this.blend = "none", this.alphaThreshold = 0, this.dithering = !1, this.fresnel = [ 1, 1, 1 ], 
                    this.horizonOcclude = 0, this.vertexColor = !1, this.vertexColorAlpha = !1, this.vertexColorSRGB = !1, 
                    this.aniso = !1, this.anisoStrength = 1, this.anisoIntegral = .5, this.anisoTangent = [ 1, 0, 0 ], 
                    this.subsurface = !1, this.subsurfaceColor = [ 1, 1, 1 ], this.transColor = [ 1, 0, 0, .5 ], 
                    this.fresnelColor = [ .2, .2, .2, .5 ], this.fresnelOcc = 1, this.fresnelGlossMask = 1, 
                    this.transSky = .5, this.shadowBlur = .5, this.normalSmooth = .5, this.unlit = !1;
                },
                read: function(a) {
                    this.name = b.read(a), this.textures.albedo = this.readTexture(a), this.textures.alpha = this.readTexture(a), 
                    this.textures.reflectivity = this.readTexture(a), this.textures.gloss = this.readTexture(a), 
                    this.textures.normal = this.readTexture(a), this.textures.subsurface = this.readTexture(a), 
                    this.colors.albedo = a.U32(), this.colors.alpha = a.U32(), this.colors.reflectivity = a.U32(), 
                    this.colors.gloss = a.U32(), this.colors.normal = a.U32(), this.colors.subsurface = a.U32();
                    var c = new f(D);
                    c.read(a), this.readProps(c), this.extras.read(a);
                },
                write: function(a) {
                    b.write(this.name, a), this.writeTexture(this.textures.albedo, a), this.writeTexture(this.textures.alpha, a), 
                    this.writeTexture(this.textures.reflectivity, a), this.writeTexture(this.textures.gloss, a), 
                    this.writeTexture(this.textures.normal, a), this.writeTexture(this.textures.subsurface, a), 
                    a.U32(this.colors.albedo), a.U32(this.colors.alpha), a.U32(this.colors.reflectivity), 
                    a.U32(this.colors.gloss), a.U32(this.colors.normal), a.U32(this.colors.subsurface);
                    var c = new f(D);
                    this.setupProps(c), c.write(a), this.extras.write(a);
                },
                readTexture: function(a) {
                    var b = a.U32();
                    if (b > 0) {
                        var d = this.awd.getAssetByID(b, [ c.MODEL_TEXTURE ]);
                        if (d[0]) return d[1];
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
                    return b.albedo && a.push(b.albedo), b.alpha && a.push(b.alpha), b.reflectivity && a.push(b.reflectivity), 
                    b.gloss && a.push(b.gloss), b.normal && a.push(b.normal), b.subsurface && a.push(b.subsurface), 
                    a;
                },
                toString: function() {
                    return "[Material " + this.pData.name + "]";
                }
            });
            module.exports = E;
        }, {
            libawd: 13,
            "optx/extInfos": 12
        } ],
        8: [ function(require, module, exports) {
            function a() {
                this.material = null, this.firstIndex = 0, this.indexCount = 0, this.firstWireIndex = 0, 
                this.wireIndexCount = 0;
            }
            var b = require("libawd"), c = b.consts, d = b.BaseElement, e = b.userAttr, f = b.properties, g = require("optx/extInfos"), h = require("optx/Container"), i = {
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
            libawd: 13,
            "optx/Container": 3,
            "optx/extInfos": 12
        } ],
        9: [ function(require, module, exports) {
            var a = require("libawd"), b = a.consts, c = a.BaseElement, d = a.userAttr, e = require("optx/extInfos"), f = require("optx/Container"), g = 0, h = 1, i = c.createStruct(e.OPTX_SKY, e.URI, {
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
            f.extend(i.prototype), module.exports = i;
        }, {
            libawd: 13,
            "optx/Container": 3,
            "optx/extInfos": 12
        } ],
        10: [ function(require, module, exports) {
            var a = require("libawd"), b = a.awdString, c = a.consts, d = a.BaseElement, e = a.userAttr, f = require("optx/extInfos"), g = d.createStruct(f.OPTX_TEXTURE, f.URI, {
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
                write: function(a) {
                    b.write(this.name, a);
                    var c = null !== this.embedData, d = +c;
                    if (a.U8(d), c) a.U32(this.embedData.length), a.writeSub(this.embedData); else {
                        if (null === this.uri) throw new Error("Texture have no embedData nor uri");
                        b.write(this.uri, a);
                    }
                    this.extras.write(a);
                },
                getDependencies: function() {
                    return null;
                },
                toString: function() {
                    return "[Texture " + this.name + "]";
                }
            });
            module.exports = g;
        }, {
            libawd: 13,
            "optx/extInfos": 12
        } ],
        11: [ function(require, module, exports) {
            var a = require("libawd"), b = a.extension, c = require("optx/Geometry"), d = require("optx/Mesh"), e = require("optx/Material"), f = require("optx/Texture"), g = require("optx/CompositeTexture"), h = require("optx/Light"), i = require("optx/Env"), j = require("optx/Sky"), k = require("optx/Camera"), l = require("optx/extInfos"), m = [ c, d, e, f, g, h, i, j, k ], n = l;
            n.getExtension = function() {
                var a = new b(l.URI);
                return a.addStructs(m), a;
            }, module.exports = n;
        }, {
            libawd: 13,
            "optx/Camera": 1,
            "optx/CompositeTexture": 2,
            "optx/Env": 4,
            "optx/Geometry": 5,
            "optx/Light": 6,
            "optx/Material": 7,
            "optx/Mesh": 8,
            "optx/Sky": 9,
            "optx/Texture": 10,
            "optx/extInfos": 12
        } ],
        12: [ function(require, module, exports) {
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
                OPTX_CAMERA: 9
            };
        }, {} ],
        13: [ function(require, module, exports) {
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
            BaseElement: 15,
            DefaultElement: 16,
            Namespace: 17,
            awd: 18,
            bufferReader: 19,
            bufferWriter: 20,
            chunk: 21,
            consts: 22,
            extension: 23,
            header: 24,
            lang: 25,
            "string.prototype.codepointat": 14,
            "tools/computeBounds": 26,
            "tools/flipFaces": 27,
            "tools/flipUvsY": 28,
            "tools/flipX": 29,
            "tools/transform": 30,
            "types/awdString": 31,
            "types/matrix": 32,
            "types/properties": 33,
            "types/userAttr": 34,
            "types/vec3": 35,
            writer: 36
        } ],
        14: [ function(require, module, exports) {
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
        15: [ function(require, module, exports) {
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
            chunk: 21,
            consts: 22
        } ],
        16: [ function(require, module, exports) {
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
            BaseElement: 15,
            consts: 22
        } ],
        17: [ function(require, module, exports) {
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
            BaseElement: 15,
            consts: 22,
            "types/awdString": 31
        } ],
        18: [ function(require, module, exports) {
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
            DefaultElement: 16,
            bufferReader: 19,
            chunk: 21,
            consts: 22,
            header: 24,
            writer: 36
        } ],
        19: [ function(require, module, exports) {
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
        20: [ function(require, module, exports) {
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
            "string.prototype.codepointat": 14
        } ],
        21: [ function(require, module, exports) {
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
        22: [ function(require, module, exports) {
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
        23: [ function(require, module, exports) {
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
            DefaultElement: 16,
            Namespace: 17
        } ],
        24: [ function(require, module, exports) {
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
            consts: 22
        } ],
        25: [ function(require, module, exports) {
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
        26: [ function(require, module, exports) {
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
            consts: 22
        } ],
        27: [ function(require, module, exports) {
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
            consts: 22
        } ],
        28: [ function(require, module, exports) {
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
            consts: 22
        } ],
        29: [ function(require, module, exports) {
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
            consts: 22
        } ],
        30: [ function(require, module, exports) {
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
            consts: 22
        } ],
        31: [ function(require, module, exports) {
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
        32: [ function(require, module, exports) {
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
        33: [ function(require, module, exports) {
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
            bufferReader: 19,
            bufferWriter: 20,
            consts: 22,
            "types/awdString": 31
        } ],
        34: [ function(require, module, exports) {
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
            bufferReader: 19,
            bufferWriter: 20,
            consts: 22,
            "types/awdString": 31
        } ],
        35: [ function(require, module, exports) {
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
            consts: 22,
            "types/properties": 33
        } ],
        36: [ function(require, module, exports) {
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
            bufferWriter: 20
        } ],
        awdlib_optx: [ function(require, module, exports) {
            var a = require("optx/Camera"), b = require("optx/CompositeTexture"), c = require("optx/Container"), d = require("optx/Env"), e = require("optx/Geometry"), f = require("optx/Light"), g = require("optx/Material"), h = require("optx/Mesh"), i = require("optx/Sky"), j = require("optx/Texture"), k = require("optx/ext"), l = require("optx/extInfos"), m = {
                Camera: a,
                CompositeTexture: b,
                Container: c,
                Env: d,
                Geometry: e,
                Light: f,
                Material: g,
                Mesh: h,
                Sky: i,
                Texture: j,
                ext: k,
                extInfos: l
            };
            module.exports = m;
        }, {
            "optx/Camera": 1,
            "optx/CompositeTexture": 2,
            "optx/Container": 3,
            "optx/Env": 4,
            "optx/Geometry": 5,
            "optx/Light": 6,
            "optx/Material": 7,
            "optx/Mesh": 8,
            "optx/Sky": 9,
            "optx/Texture": 10,
            "optx/ext": 11,
            "optx/extInfos": 12
        } ]
    }, {}, [])("awdlib_optx");
});