(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "types/properties" ),
      AwdString   = require( "types/awdString" ),
      Consts      = require( "consts" ),
      UserAttr    = require( "types/userAttr" ),
      Matrix4     = require( "../../src/types/matrix" ),
      BaseElement = require( 'BaseElement' );

  var Skeleton = BaseElement.createStruct( Consts.SKELETON, null,

  {

    init : function( ){
      this.name = "";
      this.model = Consts.MODEL_SKELETON;
      this.extras = new UserAttr();
      this.props = new Properties({});
      this.joints = [];
      this.jointsByIds = {};
    },


    read : function( reader ){
      this.name = AwdString.read( reader );

      var numJoints = reader.U16();
      this.props.read( reader );

      this.joints = [];
      for (var i = 0; i < numJoints; i++) {
        var joint = new SkeletonJoint();
        joint.read( this.awd, reader );
        this.jointsByIds[joint.id] = joint;
        this.joints.push( joint );
      }

      this.extras.read( reader );

    },


    write : ( CONFIG_WRITE ) ?
    function( writer ) {

      AwdString.write( this.name, writer );

      writer.U16( this.joints.length );

      this.props.write( writer );

      for (var i = 0; i < this.joints.length; i++) {
        this.joints[i].write( this.awd, writer );
      }

      this.extras.write( writer );

    }:undefined,

    toString : function(){
      return '[Skeleton' + this.name + ']';
    }


  } );




  function SkeletonJoint(){
    this.id = 0;
    this.parentId = -1;
    this.name = '';
    this.bindPose = new Matrix4();
    this.props = new Properties({});
    this.extras = new UserAttr();
  }


  SkeletonJoint.prototype = {


    read : function( awd, reader ){

      this.id       = reader.U16();
      this.parentId = reader.U16();

      this.name = AwdString.read( reader );
      this.bindPose.read( awd, reader );

      this.props. read( reader );
      this.extras.read( reader );

    },


    write : ( CONFIG_WRITE ) ?
    function( awd, writer ) {

      writer.U16( this.id );
      writer.U16( this.parentId );

      AwdString.write( this.name, writer );
      this.bindPose.write( awd, writer );

      this.props.write( writer );
      this.extras.write( writer );

    }:undefined

  };


  module.exports = Skeleton;

}());