(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "../types/properties" ),
      AwdString   = require( "../types/awdString" ),
      Consts      = require( "../consts" ),
      UserAttr    = require( "../types/userAttr" ),
      Matrix4     = require( "../types/matrix" ),
      BaseElement = require( '../BaseElement' );

  var SkeletonPose = BaseElement.createStruct( Consts.SKELETON_POSE, null,

  {

    init : function( ){
      this.name = "";
      this.model = Consts.MODEL_SKELETON_POSE;
      this.extras = new UserAttr();
      this.props = new Properties({});
      this.transforms = [];
    },


    read : function( reader ){
      this.name = AwdString.read( reader );

      var numTransforms = reader.U16();
      this.props.read( reader );

      this.transforms = [];
      for (var i = 0; i < numTransforms; i++) {
        var transform = new JointTransform();
        transform.read( this.awd, reader );
        this.transforms.push( transform );
      }

      this.extras.read( reader );

    },


    write : ( CONFIG_WRITE ) ?
    function( writer ) {

      AwdString.write( this.name, writer );

      writer.U16( this.transforms.length );

      this.props.write( writer );

      for (var i = 0; i < this.transforms.length; i++) {
        this.transforms[i].write( this.awd, writer );
      }

      this.extras.write( writer );

    }:undefined,

    toString : function(){
      return '[SkeletonPose' + this.name + ']';
    }


  } );




  function JointTransform(){
    this.hasTransform = false;
    this.transform = new Matrix4();
  }


  JointTransform.prototype = {


    read : function( awd, reader ){
      this.hasTransform = (reader.U8() !== 0);
      this.transform.read( awd, reader );
    },


    write : ( CONFIG_WRITE ) ?
    function( awd, writer ) {
      writer.U8( this.hasTransform?1:0 );
      this.transform.write( awd, writer );
    }:undefined

  };


  module.exports = SkeletonPose;

}());