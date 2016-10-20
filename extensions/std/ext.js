var Extension     = require( '../../src/extension' );

var DefaultElement     = require( '../../src/DefaultElement' ),
    Metadata           = require( './Metadata' ),
    Container          = require( './Container' ),
    Mesh               = require( './Mesh' ),
    Texture            = require( './Texture' ),
    Material           = require( './Material' ),
    Skeleton           = require( './Skeleton' ),
    SkeletonPose       = require( './SkeletonPose' ),
    SkeletonAnimation  = require( './SkeletonAnimation' ),
    AnimationSet       = require( './AnimationSet' ),
    Animator           = require( './Animator' ),
    //Namespace          = require( 'std/Namespace' ),
    Geometry           = require( './Geometry' );


var structs = [
  DefaultElement,
  Metadata,
  Container,
  Mesh,
  Texture,
  Material,
  Skeleton,
  SkeletonPose,
  SkeletonAnimation,
  AnimationSet,
  Animator,
  //Namespace,
  Geometry
];

var Ext = {};


Ext.getExtension = function(){
  var extension = new Extension( null );
  extension.addStructs( structs );
  return extension;
};


module.exports = Ext;