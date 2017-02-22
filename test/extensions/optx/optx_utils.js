'use strict';


var Awd     = require('../../../lib/awd'),
    Consts = require('../../../lib/consts'),
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Mesh = require('../../../lib/optx/Mesh'),
    Ext  = require('../../../lib/optx/ext');

var utils = {

  createMesh : function( name ) {
    name = name || "mesh"
    var mesh = new Mesh()
    mesh.name = name;
    return mesh;
  }
}

module.exports = utils;