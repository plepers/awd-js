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
            var b = a("optx/_awdlib").get(), c = b.consts, d = b.BaseElement, e = b.userAttr, f = a("optx/extInfos"), g = a("optx/Container"), h = 0, i = 1, j = d.createStruct(f.OPTX_CAMERA, f.URI, {
                init: function() {
                    this.model = c.MODEL_CAMERA, g["super"](this), this.name = "", this.extras = new e(), 
                    this.lensType = h, this.near = .1, this.far = 1e3, this.fov = 60, this.minX = -20, 
                    this.maxX = 20, this.minY = -20, this.maxY = 20, this.post = null;
                },
                makePerspective: function(a, b, c) {
                    this.lensType = h, this.fov = a, this.near = b, this.far = c;
                },
                makeOrtho: function(a, b, c, d, e, f) {
                    this.lensType = i, this.minX = a, this.maxX = b, this.minY = c, this.maxY = d, this.near = e, 
                    this.far = f;
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var b = a.U32();
                    if (this.lensType = a.U8(), this.near = a.F32(), this.far = a.F32(), this.lensType === h ? this.fov = a.F32() : this.lensType === i && (this.minX = a.F32(), 
                    this.maxX = a.F32(), this.minY = a.F32(), this.maxY = a.F32()), this.extras.read(a), 
                    b > 0) {
                        var d = this.awd.getAssetByID(b, [ c.MODEL_GENERIC ]);
                        if (d[0]) return d[1];
                        throw new Error("Could not find Post for this Camera, uid : " + b);
                    }
                    return null;
                },
                write: function(a) {
                    this.writeNodeCommon(a);
                    var b = 0;
                    this.post && (b = this.post.chunk.id), a.U32(b), a.U8(this.lensType), a.F32(this.near), 
                    a.F32(this.far), this.lensType === h ? a.F32(this.fov) : this.lensType === i && (a.F32(this.minX), 
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
            g.extend(j.prototype), module.exports = j;
        }, {
            "optx/Container": 3,
            "optx/_awdlib": 12,
            "optx/extInfos": 14
        } ],
        2: [ function(a, module, exports) {
            function b(a) {
                var b, c = 3 & a >>> 6, d = 3 & a >>> 4, e = 3 & a >>> 2, f = 3 & a;
                return b = d === c ? e === c ? f === c ? j[f] : j[f] + j[e] : j[f] + j[e] + j[d] : j[f] + j[e] + j[d] + j[c];
            }
            function c(a) {
                for (var b = a.split(""); b.length > 1 && b[b.length - 1] === b[b.length - 2]; ) b.pop();
                for (var c, d = 0, e = 0; e < b.length; e++) c = k[b[e]], d |= c << 2 * e;
                for (;4 > e; e++) d |= c << 2 * e;
                return d;
            }
            var d = a("optx/_awdlib").get(), e = d.awdString, f = d.consts, g = d.BaseElement, h = d.userAttr, i = a("optx/extInfos"), j = [ "r", "g", "b", "a" ], k = {
                r: 0,
                g: 1,
                b: 2,
                a: 3
            }, l = g.createStruct(i.OPTX_COMPOSITE_TEXTURE, i.URI, {
                init: function() {
                    this.model = f.MODEL_TEXTURE, this.name = "", this.extras = new h(), this.components = null;
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
                write: function(a) {
                    e.write(this.name, a), this.assertValid();
                    var b = this.components.length;
                    a.U8(b);
                    for (var d = 0; b > d; d++) {
                        var f = this.components[d];
                        a.U8(c(f.out)), a.U8(c(f.comps)), a.U32(f.tex.chunk.id);
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
            module.exports = l;
        }, {
            "optx/_awdlib": 12,
            "optx/extInfos": 14
        } ],
        3: [ function(a, module, exports) {
            var b = a("optx/_awdlib").get(), c = b.awdString, d = b.consts, e = b.BaseElement, f = b.vec3, g = b.matrix, h = e.createStruct(-1, null, {
                init: function() {
                    this.model = d.MODEL_CONTAINER, h["super"](this);
                },
                readNodeCommon: function(a) {
                    var b = a.U32();
                    this.matrix.read(this.awd, a), this.pivot.parsePivot(this.awd, a), this.name = c.read(a);
                    var e = this.awd.getAssetByID(b, [ d.MODEL_CONTAINER, d.MODEL_MESH, d.MODEL_LIGHT, d.MODEL_ENTITY, d.MODEL_SEGMENT_SET ]);
                    if (e[0]) void 0 !== e[1].addChild && e[1].addChild(this), this.parent = e[1]; else if (b > 0) throw new Error("Could not find a parent for this Container id : " + b);
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
            h.extend = function(a) {
                a.addChild = h.prototype.addChild, a.removeChild = h.prototype.removeChild, a.writeNodeCommon = h.prototype.writeNodeCommon, 
                a.readNodeCommon = h.prototype.readNodeCommon, a.getGraphDependencies = h.prototype.getGraphDependencies;
            }, h["super"] = function(a) {
                a.parent = null, a.children = [], a.matrix = new g(), a.name = "", a.pivot = new f();
            }, module.exports = h;
        }, {
            "optx/_awdlib": 12
        } ],
        4: [ function(a, module, exports) {
            function b(a) {
                return a === q ? 28 : 27;
            }
            function c(a) {
                return 28 === a ? q : r;
            }
            var d = a("optx/_awdlib").get(), e = d.consts, f = d.BaseElement, g = d.userAttr, h = a("optx/extInfos"), i = a("optx/Container"), j = 1, k = 2, l = 3, m = 4, n = 5, o = 6, p = {};
            p[j] = e.AWD_FIELD_FLOAT32, p[k] = e.AWD_FIELD_FLOAT32, p[l] = e.AWD_FIELD_FLOAT32, 
            p[m] = e.AWD_FIELD_FLOAT32, p[n] = e.AWD_FIELD_FLOAT32, p[o] = e.AWD_FIELD_BOOL;
            var q = 0, r = 1, s = f.createStruct(h.OPTX_ENV, h.URI, {
                init: function() {
                    this.model = e.MODEL_CONTAINER, i["super"](this), this.name = "", this.extras = new g(), 
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
            i.extend(s.prototype), module.exports = s;
        }, {
            "optx/Container": 3,
            "optx/_awdlib": 12,
            "optx/extInfos": 14
        } ],
        5: [ function(a, module, exports) {
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
            var f = a("optx/_awdlib").get(), g = f.BaseElement, h = f.consts, i = f.awdString, j = f.userAttr, k = f.properties, l = a("optx/extInfos"), m = g.createStruct(l.OPTX_GEOM, l.URI, {
                init: function() {
                    this.model = h.MODEL_GEOMETRY, this.name = "", this.extras = new j(), this.props = new k({}), 
                    this.vertexBuffers = [], this.indexBuffers = [];
                },
                read: function(a) {
                    this.name = i.read(a);
                    var d = a.U16(), e = a.U16(), f = this.props;
                    f.read(a);
                    var g, h, j = this.vertexBuffers, k = this.indexBuffers;
                    for (g = 0; d > g; g++) h = new b(), h.read(this.awd, a), j.push(h);
                    for (g = 0; e > g; g++) h = new c(), h.read(this.awd, a), k.push(h);
                    this.extras.read(a);
                },
                write: function(a) {
                    i.write(this.name, a), a.U16(this.vertexBuffers.length), a.U16(this.indexBuffers.length);
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
            }, d.FLAG_NORMALIZED = 2, d.prototype = {
                read: function(a) {
                    this.name = i.read(a), this.numElems = a.U8(), this.glType = a.U16(), this.flags = a.U8();
                },
                write: function(a) {
                    i.write(this.name, a), a.U8(this.numElems), a.U16(this.glType), a.U8(this.flags);
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
            }, m.types = {
                BYTE: 5120,
                UNSIGNED_BYTE: 5121,
                SHORT: 5122,
                UNSIGNED_SHORT: 5123,
                INT: 5124,
                UNSIGNED_INT: 5125,
                FLOAT: 5126
            }, m.VertexBuffer = b, m.IndexBuffer = c, m.VertexAttibute = d, m.getGLTypeBytesSize = e, 
            module.exports = m;
        }, {
            "optx/_awdlib": 12,
            "optx/extInfos": 14
        } ],
        6: [ function(a, module, exports) {
            var b = a("optx/_awdlib").get(), c = b.consts, d = b.BaseElement, e = b.userAttr, f = b.properties, g = a("optx/extInfos"), h = a("optx/Container"), i = 1, j = 2, k = 3, l = 4, m = 5, n = 6, o = {};
            o[i] = c.AWD_FIELD_FLOAT32, o[j] = c.AWD_FIELD_FLOAT32, o[k] = c.AWD_FIELD_FLOAT32, 
            o[l] = c.AWD_FIELD_FLOAT32, o[m] = c.AWD_FIELD_FLOAT32, o[n] = c.AWD_FIELD_BOOL;
            var p = d.createStruct(g.OPTX_LIGHT, g.URI, {
                init: function() {
                    this.model = c.MODEL_LIGHT, h["super"](this), this.name = "", this.extras = new e(), 
                    this.shadow = !0, this.color = [ 1, 1, 1 ], this.radius = 50, this.falloffCurve = 2, 
                    this.spotAngle = 70, this.spotShapness = 0;
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var b = new f(o);
                    b.read(a), this.readProps(b), this.extras.read(a);
                },
                write: function(a) {
                    this.writeNodeCommon(a);
                    var b = new f(o);
                    this.setupProps(b), b.write(a), this.extras.write(a);
                },
                setupProps: function(a) {
                    a.set(i, this.color), a.set(j, this.radius), a.set(k, this.falloffCurve), a.set(l, this.spotAngle), 
                    a.set(m, this.spotShapness), a.set(n, this.shadow);
                },
                readProps: function(a) {
                    this.color = a.get(i, this.color), this.radius = a.get(j, this.radius), this.falloffCurve = a.get(k, this.falloffCurve), 
                    this.spotAngle = a.get(l, this.spotAngle), this.spotShapness = a.get(m, this.spotShapness), 
                    this.shadow = !!a.get(n, this.shadow);
                },
                getDependencies: function() {
                    return this.getGraphDependencies();
                },
                toString: function() {
                    return "[Light " + this.name + "]";
                }
            });
            h.extend(p.prototype), module.exports = p;
        }, {
            "optx/Container": 3,
            "optx/_awdlib": 12,
            "optx/extInfos": 14
        } ],
        7: [ function(a, module, exports) {
            var b = a("optx/_awdlib").get(), c = b.awdString, d = b.consts, e = b.BaseElement, f = b.userAttr, g = b.properties, h = a("optx/extInfos"), i = 1, j = 2, k = 3, l = 4, m = 5, n = 6, o = 7, p = 8, q = 9, r = 10, s = 11, t = 12, u = 13, v = 14, w = 15, x = 16, y = 17, z = 18, A = 19, B = 20, C = 21, D = 22, E = {};
            E[i] = d.AWD_FIELD_STRING, E[j] = d.AWD_FIELD_FLOAT32, E[k] = d.AWD_FIELD_BOOL, 
            E[l] = d.AWD_FIELD_FLOAT32, E[m] = d.AWD_FIELD_FLOAT32, E[n] = d.AWD_FIELD_BOOL, 
            E[o] = d.AWD_FIELD_BOOL, E[p] = d.AWD_FIELD_BOOL, E[q] = d.AWD_FIELD_BOOL, E[r] = d.AWD_FIELD_FLOAT32, 
            E[s] = d.AWD_FIELD_FLOAT32, E[t] = d.AWD_FIELD_FLOAT32, E[u] = d.AWD_FIELD_BOOL, 
            E[v] = d.AWD_FIELD_FLOAT32, E[w] = d.AWD_FIELD_FLOAT32, E[x] = d.AWD_FIELD_FLOAT32, 
            E[y] = d.AWD_FIELD_FLOAT32, E[z] = d.AWD_FIELD_FLOAT32, E[A] = d.AWD_FIELD_FLOAT32, 
            E[B] = d.AWD_FIELD_FLOAT32, E[C] = d.AWD_FIELD_FLOAT32, E[D] = d.AWD_FIELD_BOOL;
            var F = e.createStruct(h.OPTX_MATERIAL, h.URI, {
                init: function() {
                    this.model = d.MODEL_MATERIAL, this.name = "", this.extras = new f(), this.textures = {
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
                    this.name = c.read(a), this.textures.albedo = this.readTexture(a), this.textures.reflectivity = this.readTexture(a), 
                    this.textures.normal = this.readTexture(a), this.textures.subsurface = this.readTexture(a), 
                    this.textures.agt = this.readTexture(a), this.colors.albedo = a.U32(), this.colors.reflectivity = a.U32(), 
                    this.colors.normal = a.U32(), this.colors.subsurface = a.U32(), this.colors.agt = a.U32();
                    var b = new g(E);
                    b.read(a), this.readProps(b), this.extras.read(a);
                },
                write: function(a) {
                    c.write(this.name, a), this.writeTexture(this.textures.albedo, a), this.writeTexture(this.textures.reflectivity, a), 
                    this.writeTexture(this.textures.normal, a), this.writeTexture(this.textures.subsurface, a), 
                    this.writeTexture(this.textures.agt, a), a.U32(this.colors.albedo), a.U32(this.colors.reflectivity), 
                    a.U32(this.colors.normal), a.U32(this.colors.subsurface), a.U32(this.colors.agt);
                    var b = new g(E);
                    this.setupProps(b), b.write(a), this.extras.write(a);
                },
                readTexture: function(a) {
                    var b = a.U32();
                    if (b > 0) {
                        var c = this.awd.getAssetByID(b, [ d.MODEL_TEXTURE ]);
                        if (c[0]) return c[1];
                        throw new Error("Could not find Texture for this Material, uid : " + b);
                    }
                    return null;
                },
                writeTexture: function(a, b) {
                    a ? b.U32(a.chunk.id) : b.U32(0);
                },
                setupProps: function(a) {
                    a.set(i, this.blend), a.set(j, this.alphaThreshold), a.set(k, this.dithering), a.set(l, this.fresnel), 
                    a.set(m, this.horizonOcclude), this.vertexColor && (a.set(n, this.vertexColor), 
                    a.set(o, this.vertexColorAlpha), a.set(p, this.vertexColorSRGB), a.set(q, this.aniso)), 
                    this.aniso && (a.set(r, this.anisoStrength), a.set(s, this.anisoIntegral), a.set(t, this.anisoTangent), 
                    a.set(u, this.subsurface)), this.subsurface && (a.set(v, this.subsurfaceColor), 
                    a.set(w, this.transColor), a.set(x, this.fresnelColor), a.set(y, this.fresnelOcc), 
                    a.set(z, this.fresnelGlossMask), a.set(A, this.transSky), a.set(B, this.shadowBlur), 
                    a.set(C, this.normalSmooth)), a.set(D, this.unlit);
                },
                readProps: function(a) {
                    this.blend = a.get(i, this.blend), this.alphaThreshold = a.get(j, this.alphaThreshold), 
                    this.dithering = !!a.get(k, this.dithering), this.fresnel = a.get(l, this.fresnel), 
                    this.horizonOcclude = a.get(m, this.horizonOcclude), this.vertexColor = !!a.get(n, this.vertexColor), 
                    this.vertexColorAlpha = !!a.get(o, this.vertexColorAlpha), this.vertexColorSRGB = !!a.get(p, this.vertexColorSRGB), 
                    this.aniso = !!a.get(q, this.aniso), this.anisoStrength = a.get(r, this.anisoStrength), 
                    this.anisoIntegral = a.get(s, this.anisoIntegral), this.anisoTangent = a.get(t, this.anisoTangent), 
                    this.subsurface = !!a.get(u, this.subsurface), this.subsurfaceColor = a.get(v, this.subsurfaceColor), 
                    this.transColor = a.get(w, this.transColor), this.fresnelColor = a.get(x, this.fresnelColor), 
                    this.fresnelOcc = a.get(y, this.fresnelOcc), this.fresnelGlossMask = a.get(z, this.fresnelGlossMask), 
                    this.transSky = a.get(A, this.transSky), this.shadowBlur = a.get(B, this.shadowBlur), 
                    this.normalSmooth = a.get(C, this.normalSmooth), this.unlit = !!a.get(D, this.unlit);
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
            module.exports = F;
        }, {
            "optx/_awdlib": 12,
            "optx/extInfos": 14
        } ],
        8: [ function(a, module, exports) {
            function b() {
                this.material = null, this.firstIndex = 0, this.indexCount = 0, this.firstWireIndex = 0, 
                this.wireIndexCount = 0;
            }
            var c = a("optx/_awdlib").get(), d = c.consts, e = c.BaseElement, f = c.userAttr, g = c.properties, h = a("optx/extInfos"), i = a("optx/Container"), j = {
                cullBackFaces: 1,
                castShadows: 2,
                bounds: 10
            }, k = e.createStruct(h.OPTX_MESH, h.URI, {
                init: function() {
                    this.model = d.MODEL_MESH, i["super"](this), this.geometry = null, this.extras = new f(), 
                    this.props = new g({
                        1: d.AWD_FIELD_BOOL,
                        2: d.AWD_FIELD_BOOL,
                        10: d.AWD_FIELD_FLOAT32
                    }), this.submeshes = [];
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var c = a.U32();
                    this.props.read(a);
                    for (var e = a.U16(), f = 0; e > f; f++) {
                        var g = new b();
                        g.read(this.awd, a), this.submeshes.push(g);
                    }
                    this.extras.read(a);
                    var h = this.awd.getAssetByID(c, [ d.MODEL_GEOMETRY ]);
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
                    return 1 === this.props.get(j.cullBackFaces, !0);
                },
                setCullBackFace: function(a) {
                    this.props.set(j.cullBackFaces, a);
                },
                getCastShadows: function() {
                    return 1 === this.props.get(j.castShadows, !1);
                },
                setCastShadows: function(a) {
                    this.props.set(j.castShadows, a);
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
                    var e = a.getAssetByID(c, [ d.MODEL_MATERIAL ]);
                    if (!e[0] && c > 0) throw new Error("Could not find Material (ID = " + c + " ) for this SubMesh");
                    c > 0 && (this.material = e[1]);
                },
                write: function(a, b) {
                    var c = 0, d = this.material;
                    d && (c = d.chunk.id), b.U32(c), b.U32(this.firstIndex), b.U32(this.indexCount), 
                    b.U32(this.firstWireIndex), b.U32(this.wireIndexCount);
                }
            }, i.extend(k.prototype), k.SubMesh = b, module.exports = k;
        }, {
            "optx/Container": 3,
            "optx/_awdlib": 12,
            "optx/extInfos": 14
        } ],
        9: [ function(a, module, exports) {
            function b(a) {
                var b, c = a.U8();
                switch (c) {
                  case s:
                    b = new d();
                    break;

                  case t:
                    b = new f();
                    break;

                  case u:
                    b = new g();
                    break;

                  case v:
                    b = new h();
                    break;

                  case w:
                    b = new i();
                    break;

                  case y:
                    b = new j();
                    break;

                  case z:
                    b = new k();
                    break;

                  default:
                    throw new Error("unknown post effect type " + c);
                }
                for (var e = 0; e < b._l; e++) b.props[e] = a.F32();
                return b;
            }
            function c(a, b) {
                b.U8(a._id);
                for (var c = 0; c < a._l; c++) b.F32(a.props[c]);
            }
            function d(a, b) {
                this._l = 2, this._id = s, this.props = [ a, b ];
            }
            function e(a, b) {
                this._l = 2, this._id = x, this.props = [ a, b ];
            }
            function f(a, b) {
                this._l = 4, this._id = t, a = a || [ 1, 1, 1 ], this.props = [ a[0], a[1], a[2], b ];
            }
            function g(a, b) {
                this._l = 5, this._id = u, a = a || [ 1, 1, 1, 1 ], this.props = [ a[0], a[1], a[2], a[3], b ];
            }
            function h(a) {
                this._l = 3, this._id = v, a = a || [ 1, 1, 1 ], this.props = [ a[0], a[1], a[2] ];
            }
            function i(a, b, c) {
                this._l = 9, this._id = w, a = a || [ 1, 1, 1 ], b = b || [ 1, 1, 1 ], c = c || [ 1, 1, 1 ], 
                this.props = [ a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2] ];
            }
            function j() {
                this._l = 0, this._id = y, this.props = [];
            }
            function k() {
                this._l = 0, this._id = z, this.props = [];
            }
            var l = a("optx/_awdlib").get(), m = l.consts, n = l.BaseElement, o = l.userAttr, p = l.awdString, q = a("optx/extInfos"), r = n.createStruct(q.OPTX_POST, q.URI, {
                init: function() {
                    this.model = m.MODEL_GENERIC, this.name = "", this.effects = [], this.extras = new o();
                },
                read: function(a) {
                    this.name = p.read(a), this.effects = [];
                    for (var c = a.U8(), d = 0; c > d; d++) this.effects.push(b(a));
                    this.extras.read(a);
                },
                write: function(a) {
                    p.write(this.name, a);
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
            }), s = 1, t = 2, u = 3, v = 4, w = 5, x = 6, y = 7, z = 8;
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
            }, j.prototype = {}, k.prototype = {}, r.Sharpen = d, r.Bloom = f, r.Vignette = g, 
            r.Saturation = h, r.Contrast = i, r.Grain = e, r.Reinhard = j, r.Hejl = k, module.exports = r;
        }, {
            "optx/_awdlib": 12,
            "optx/extInfos": 14
        } ],
        10: [ function(a, module, exports) {
            var b = a("optx/_awdlib").get(), c = b.consts, d = b.BaseElement, e = b.userAttr, f = a("optx/extInfos"), g = a("optx/Container"), h = 0, i = 1, j = d.createStruct(f.OPTX_SKY, f.URI, {
                init: function() {
                    this.model = c.MODEL_CONTAINER, g["super"](this), this.name = "", this.extras = new e(), 
                    this.brightness = 1, this.env = null, this.skyType = 0;
                },
                useSHMode: function() {
                    this.skyType = h;
                },
                useEnvmapMode: function() {
                    this.skyType = i;
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var b = a.U32();
                    this.skyType = a.U8(), this.brightness = a.F32(), this.extras.read(a);
                    var d = this.awd.getAssetByID(b, [ c.MODEL_CONTAINER ]);
                    if (!d[0] && d > 0) throw new Error("Could not find env (ID = " + b + " ) for this Sky");
                    b > 0 && (this.env = d[1]);
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
            g.extend(j.prototype), module.exports = j;
        }, {
            "optx/Container": 3,
            "optx/_awdlib": 12,
            "optx/extInfos": 14
        } ],
        11: [ function(a, module, exports) {
            var b = a("optx/_awdlib").get(), c = b.awdString, d = b.consts, e = b.BaseElement, f = b.userAttr, g = a("optx/extInfos"), h = e.createStruct(g.OPTX_TEXTURE, g.URI, {
                init: function() {
                    this.model = d.MODEL_TEXTURE, this.name = "", this.extras = new f(), this.embedData = null, 
                    this.uri = null;
                },
                read: function(a) {
                    this.name = c.read(a);
                    var b = a.U8(), d = !!(1 & b);
                    if (d) {
                        var e = a.U32();
                        this.embedData = a.subArray(e);
                    } else this.uri = c.read(a);
                    this.extras.read(a);
                },
                write: function(a) {
                    c.write(this.name, a);
                    var b = null !== this.embedData, d = +b;
                    if (a.U8(d), b) a.U32(this.embedData.length), a.writeSub(this.embedData); else {
                        if (null === this.uri) throw new Error("Texture have no embedData nor uri");
                        c.write(this.uri, a);
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
            module.exports = h;
        }, {
            "optx/_awdlib": 12,
            "optx/extInfos": 14
        } ],
        12: [ function(a, module, exports) {
            var b;
            module.exports = {
                set: function(a) {
                    b = a;
                },
                get: function() {
                    return b;
                }
            };
        }, {} ],
        13: [ function(a, module, exports) {
            var b = a("optx/_awdlib").get(), c = b.extension, d = a("optx/Geometry"), e = a("optx/Mesh"), f = a("optx/Material"), g = a("optx/Texture"), h = a("optx/CompositeTexture"), i = a("optx/Light"), j = a("optx/Env"), k = a("optx/Sky"), l = a("optx/Camera"), m = a("optx/Post"), n = a("optx/extInfos"), o = [ d, e, f, g, h, i, j, k, l, m ], p = n;
            p.getExtension = function() {
                var a = new c(n.URI);
                return a.addStructs(o), a;
            }, module.exports = p;
        }, {
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
            "optx/_awdlib": 12,
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
        awdlib_optx: [ function(a, module, exports) {
            module.exports = function(b) {
                return a("optx/_awdlib").set(b), {
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
                    ext: a("optx/ext"),
                    extInfos: a("optx/extInfos")
                };
            };
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
            "optx/_awdlib": 12,
            "optx/ext": 13,
            "optx/extInfos": 14
        } ]
    }, {}, [])("awdlib_optx");
});