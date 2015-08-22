'use strict';


var awdlib = require('libawd' );
var optx = require('libawd_optx' );

var Awd = awdlib.awd,
    Consts = awdlib.consts,
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Mesh = optx.Mesh,
    Ext = optx.ext;

var utils = {

  createMesh : function( name ) {
    name = name || "mesh"
    var mesh = new Mesh()
    mesh.name = name;
    return mesh;
  }
}

module.exports = utils;