'use strict';


var awdlib = require('awdlib' );
var optx = require('awdlib_optx' );

var Awd = awdlib.awd,
    Consts = awdlib.consts,
    fs =  require( 'fs' ),
    expect  = require('expect.js'),
    utils  = require('./optx_utils'),
    butils = require( '../../utils/buffer_utils'),
    compArray = require( '../../utils/compareArrays'),
    Post = optx.Post,
    Ext = optx.ext;


function numEqals( n1, n2 ){
  expect( Math.abs(n1 - n2) < 0.00001 ).to.be.equal( true );
}


function createEmptyPost(){
  var post = new Post();
  post.name = 'emptyPost';
  return post;
}


function createContrast(){
  var post = new Post();
  post.name = 'post';
  post.effects.push( new Post.Contrast( [.1, .2, .3], [.4, .5, .6], [.7, .8, .9] ) );
  return post;
}


describe( "optx Post test", function(){



  var awdBuf, awd;

  beforeEach(function(  ){

    awd = new Awd( );
    awd.addExtension( Ext.getExtension() );

  });

  it( "write empty Post", function(){

    var post = createEmptyPost()
    awd.addElement( post );
    var buf = awd.write();
  });


  it( "write and read back empty post", function(){

    var post = createEmptyPost()
    awd.addElement( post );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var posts = nawd.getDatasByType( Ext.OPTX_POST, Ext.URI );
    expect( posts.length ).to.be.equal( 1 );
    var post = posts[0];

    expect( post.name ).to.be('emptyPost')

    expect( post.effects ).to.be.ok();
    expect( post.effects.length ).to.be.equal(0);

  });


  it( "write and read back contrast", function(){

    var post = createContrast()
    awd.addElement( post );
    var buf = awd.write();


    var nawd = new Awd( );
    nawd.addExtension( Ext.getExtension() );
    nawd.parse( buf )


    var posts = nawd.getDatasByType( Ext.OPTX_POST, Ext.URI );
    expect( posts.length ).to.be.equal( 1 );
    var post = posts[0];

    expect( post.name ).to.be('post')

    expect( post.effects ).to.be.ok();
    expect( post.effects.length ).to.be.equal(1);

    var c = post.effects[0];

    numEqals( c.getBrightness()[0],  .1 );
    numEqals( c.getBrightness()[1],  .2 );
    numEqals( c.getBrightness()[2],  .3 );
    numEqals( c.getContrast()[0],    .4 );
    numEqals( c.getContrast()[1],    .5 );
    numEqals( c.getContrast()[2],    .6 );
    numEqals( c.getBias()[0],        .7 );
    numEqals( c.getBias()[1],        .8 );
    numEqals( c.getBias()[2],        .9 );


  });


});

