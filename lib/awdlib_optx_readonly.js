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
                write: void 0,
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
            "optx/_awdlib": 13,
            "optx/extInfos": 15
        } ],
        2: [ function(a, module, exports) {
            function b(a) {
                var b, c = 3 & a >>> 6, d = 3 & a >>> 4, e = 3 & a >>> 2, f = 3 & a;
                return b = d === c ? e === c ? f === c ? i[f] : i[f] + i[e] : i[f] + i[e] + i[d] : i[f] + i[e] + i[d] + i[c];
            }
            var c = a("optx/_awdlib").get(), d = c.awdString, e = c.consts, f = c.BaseElement, g = c.userAttr, h = a("optx/extInfos"), i = [ "r", "g", "b", "a" ], j = f.createStruct(h.OPTX_COMPOSITE_TEXTURE, h.URI, {
                init: function() {
                    this.model = e.MODEL_TEXTURE, this.name = "", this.extras = new g(), this.components = null;
                },
                resolveTexture: function(a) {
                    var b = this.awd.getAssetByID(a, [ e.MODEL_TEXTURE ]);
                    if (b[0]) return b[1];
                    throw new Error("Could not find referenced Texture for this CompositeTexture, uid : " + a);
                },
                read: function(a) {
                    this.name = d.read(a);
                    var c = a.U8();
                    this.components = [];
                    for (var e = 0; c > e; e++) this.components.push({
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
            module.exports = j;
        }, {
            "optx/_awdlib": 13,
            "optx/extInfos": 15
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
            h.extend = function(a) {
                a.addChild = h.prototype.addChild, a.removeChild = h.prototype.removeChild, a.writeNodeCommon = h.prototype.writeNodeCommon, 
                a.readNodeCommon = h.prototype.readNodeCommon, a.getGraphDependencies = h.prototype.getGraphDependencies;
            }, h["super"] = function(a) {
                a.parent = null, a.children = [], a.matrix = new g(), a.name = "", a.pivot = new f();
            }, module.exports = h;
        }, {
            "optx/_awdlib": 13
        } ],
        4: [ function(a, module, exports) {
            function b(a) {
                return a === i ? 28 : 27;
            }
            var c = a("optx/_awdlib").get(), d = c.consts, e = c.BaseElement, f = c.userAttr, g = a("optx/extInfos"), h = a("optx/Container"), i = 0, j = e.createStruct(g.OPTX_ENV, g.URI, {
                init: function() {
                    this.model = d.MODEL_CONTAINER, h["super"](this), this.name = "", this.extras = new f(), 
                    this.shCoefs = null, this.brightness = 1, this.envMap = null;
                },
                read: function(a) {
                    this.readNodeCommon(a);
                    var c = a.U32(), e = a.U8(), f = b(e);
                    this.shCoefs = new Float32Array(f);
                    for (var g = 0; f > g; g++) this.shCoefs[g] = a.F32();
                    this.brightness = a.F32(), this.extras.read(a);
                    var h = this.awd.getAssetByID(c, [ d.MODEL_TEXTURE ]);
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
            h.extend(j.prototype), module.exports = j;
        }, {
            "optx/Container": 3,
            "optx/_awdlib": 13,
            "optx/extInfos": 15
        } ],
        5: [ function(a, module, exports) {
            function b() {
                this.data = null, this.mime = "application/octet-stream", this.uri = "";
            }
            var c = a("optx/_awdlib").get(), d = c.awdString;
            b.prototype.read = function(a) {
                this.mime = d.read(a), this.uri = d.read(a);
                var b = a.U32();
                this.data = a.subArray(b);
            }, module.exports = b;
        }, {
            "optx/_awdlib": 13
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
            "optx/_awdlib": 13,
            "optx/extInfos": 15
        } ],
        7: [ function(a, module, exports) {
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
                write: void 0,
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
            "optx/_awdlib": 13,
            "optx/extInfos": 15
        } ],
        8: [ function(a, module, exports) {
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
                write: void 0,
                readTexture: function(a) {
                    var b = a.U32();
                    if (b > 0) {
                        var c = this.awd.getAssetByID(b, [ d.MODEL_TEXTURE ]);
                        if (c[0]) return c[1];
                        throw new Error("Could not find Texture for this Material, uid : " + b);
                    }
                    return null;
                },
                writeTexture: void 0,
                setupProps: void 0,
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
                getDependencies: void 0,
                toString: function() {
                    return "[Material " + this.pData.name + "]";
                }
            });
            module.exports = F;
        }, {
            "optx/_awdlib": 13,
            "optx/extInfos": 15
        } ],
        9: [ function(a, module, exports) {
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
                write: void 0,
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
            "optx/_awdlib": 13,
            "optx/extInfos": 15
        } ],
        10: [ function(a, module, exports) {
            function b(a) {
                var b, k = a.U8();
                switch (k) {
                  case r:
                    b = new c();
                    break;

                  case s:
                    b = new e();
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
                    b = new d();
                    break;

                  case x:
                    b = new i();
                    break;

                  case y:
                    b = new j();
                    break;

                  default:
                    throw new Error("unknown post effect type " + k);
                }
                for (var l = 0; l < b._l; l++) b.props[l] = a.F32();
                return b;
            }
            function c(a, b) {
                this._l = 2, this._id = r, this.props = [ a, b ];
            }
            function d(a, b) {
                this._l = 2, this._id = w, this.props = [ a, b ];
            }
            function e(a, b) {
                this._l = 4, this._id = s, a = a || [ 1, 1, 1 ], this.props = [ a[0], a[1], a[2], b ];
            }
            function f(a, b) {
                this._l = 5, this._id = t, a = a || [ 1, 1, 1, 1 ], this.props = [ a[0], a[1], a[2], a[3], b ];
            }
            function g(a) {
                this._l = 3, this._id = u, a = a || [ 1, 1, 1 ], this.props = [ a[0], a[1], a[2] ];
            }
            function h(a, b, c) {
                this._l = 9, this._id = v, a = a || [ 1, 1, 1 ], b = b || [ 1, 1, 1 ], c = c || [ 1, 1, 1 ], 
                this.props = [ a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2] ];
            }
            function i() {
                this._l = 0, this._id = x, this.props = [];
            }
            function j() {
                this._l = 0, this._id = y, this.props = [];
            }
            var k = a("optx/_awdlib").get(), l = k.consts, m = k.BaseElement, n = k.userAttr, o = k.awdString, p = a("optx/extInfos"), q = m.createStruct(p.OPTX_POST, p.URI, {
                init: function() {
                    this.model = l.MODEL_GENERIC, this.name = "", this.effects = [], this.extras = new n();
                },
                read: function(a) {
                    this.name = o.read(a), this.effects = [];
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
            }), r = 1, s = 2, t = 3, u = 4, v = 5, w = 6, x = 7, y = 8;
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
            }, c.prototype = {
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
            }, i.prototype = {}, j.prototype = {}, q.Sharpen = c, q.Bloom = e, q.Vignette = f, 
            q.Saturation = g, q.Contrast = h, q.Grain = d, q.Reinhard = i, q.Hejl = j, module.exports = q;
        }, {
            "optx/_awdlib": 13,
            "optx/extInfos": 15
        } ],
        11: [ function(a, module, exports) {
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
                write: void 0,
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
            "optx/_awdlib": 13,
            "optx/extInfos": 15
        } ],
        12: [ function(a, module, exports) {
            var b = a("optx/_awdlib").get(), c = b.awdString, d = b.consts, e = b.BaseElement, f = b.properties, g = b.userAttr, h = a("optx/extInfos"), i = a("optx/FileData"), j = 1, k = 2, l = 3, m = 4, n = 5, o = {};
            o[j] = d.AWD_FIELD_UINT32, o[k] = d.AWD_FIELD_UINT32, o[l] = d.AWD_FIELD_UINT32, 
            o[m] = d.AWD_FIELD_UINT32, o[n] = d.AWD_FIELD_UINT32;
            var p = e.createStruct(h.OPTX_TEXTURE, h.URI, {
                init: function() {
                    this.model = d.MODEL_TEXTURE, this.name = "", this.extras = new g(), this.fileData = null, 
                    this.uri = null, this.infos = {};
                },
                read: function(a) {
                    this.name = c.read(a);
                    var b = a.U8(), d = !!(1 & b);
                    d ? (this.fileData = new i(), this.fileData.read(a)) : this.uri = c.read(a);
                    var e = new f(o);
                    e.read(a), this.readProps(e), this.extras.read(a);
                },
                write: void 0,
                setupProps: void 0,
                readProps: function(a) {
                    var b = this.infos;
                    b.width = a.get(j, b.width), b.height = a.get(k, b.height), b.glinternalFormat = a.get(l, b.glinternalFormat), 
                    b.glformat = a.get(m, b.glformat), b.gltype = a.get(n, b.gltype);
                },
                getDependencies: function() {
                    return null;
                },
                toString: function() {
                    return "[Texture " + this.name + "]";
                }
            });
            module.exports = p;
        }, {
            "optx/FileData": 5,
            "optx/_awdlib": 13,
            "optx/extInfos": 15
        } ],
        13: [ function(a, module, exports) {
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
        14: [ function(a, module, exports) {
            var b = a("optx/_awdlib").get(), c = b.extension, d = a("optx/Geometry"), e = a("optx/Mesh"), f = a("optx/Material"), g = a("optx/Texture"), h = a("optx/CompositeTexture"), i = a("optx/Light"), j = a("optx/Env"), k = a("optx/Sky"), l = a("optx/Camera"), m = a("optx/Post"), n = a("optx/extInfos"), o = [ d, e, f, g, h, i, j, k, l, m ], p = n;
            p.getExtension = function() {
                var a = new c(n.URI);
                return a.addStructs(o), a;
            }, module.exports = p;
        }, {
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
            "optx/_awdlib": 13,
            "optx/extInfos": 15
        } ],
        15: [ function(a, module, exports) {
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
                    FileData: a("optx/FileData"),
                    ext: a("optx/ext"),
                    extInfos: a("optx/extInfos")
                };
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
            "optx/_awdlib": 13,
            "optx/ext": 14,
            "optx/extInfos": 15
        } ]
    }, {}, [])("awdlib_optx");
});