
// var Consts = AWD.Consts;
var Properties  = require( "types/properties" ),
    AwdString   = require( "types/awdString" ),
    Consts      = require( "consts" ),
    UserAttr    = require( "types/userAttr" ),
    BaseElement = require( 'BaseElement' );

var ExtInfos     = require( './extInfos' );

/*  STRUCT
      AWD_STRING   name
      U16          num frames
      U16          num bones
      PROPS        props
      U8           num padding
      *            padding
      float*       data
      USER_ATTR    extras

*/


var SkeletonAnimation = BaseElement.createStruct( ExtInfos.COMPACT_SKEL_ANIM, ExtInfos.URI,

{

  init : function( ){
    this.name = "";
    this.model = Consts.MODEL_ANIMATION_STATE;
    this.extras = new UserAttr();
    this.props = new Properties({});

    this.numFrames = 0;
    this.numBones  = 0;
    // inlined [pos,quat] tuples, per frames, per bones
    this.data      = null; 
  },


  read : function( reader ){
    this.name = AwdString.read( reader );

    this.numFrames = reader.U16();
    this.numBones  = reader.U16();
    
    this.props.read( reader );

    var padding   = reader.U8();
    reader.ptr += padding;


    var numfloat = this.numFrames * this.numBones * (3+4);
    this.data = new Float32Array( reader.buffer, reader.ptr, numfloat );
    reader.ptr += numfloat * 4;

    this.extras.read( reader );

  },


  write : ( CONFIG_WRITE ) ?
  function( writer ) {

    AwdString.write( this.name, writer );

    writer.U16( this.numFrames );
    writer.U16( this.numBones );

    this.props.write( writer );


    // align to 4  bytes
    var pad = 4 - ((writer.ptr+5) % 4);
    writer.U8( pad );
    for( var i = 0; i< pad; i++){
      writer.U8( 0 );
    }

    var dataInt = new Int8Array( this.data.buffer, this.data.byteOffset, this.data.byteLength );
    writer.writeSub( dataInt );

    this.extras.write( writer );

  }:undefined,


  convertFromSkeletonAnimation : function( sanim ){

    // Array of SkeletonPose
    var frames = sanim.frames;

    this.numFrames = frames.length;

    // find the num of bones in the first frame
    this.numBones = frames[0].pose.transforms.length;


    this.data = new Float32Array( this.numFrames * this.numBones * (3+4) );
    var ptr = 0;

    for (var i = 0; i < frames.length; i++) {
      ptr = encodeFrame( this.data, ptr, frames[i].pose );
    }

  },



  toString : function(){
    return '[CompactSkeletonAnimation' + this.name + ']';
  }


} );


function encodeFrame( data, ptr, frame ){

  var transforms = frame.transforms;
  for (var i = 0; i < transforms.length; i++) {
    ptr = encodePose( data, ptr, transforms[i] );
  }

  return ptr;
}


function encodePose( data, ptr, pose ){
  var m4 = pose.transform.data;
  encodeMat( data, ptr, m4 );
  return ptr + 7;
}


var M3 = new Float32Array( 9 );

function encodeMat( data, ptr, m4 ){

  data[ptr+0] = m4[12];
  data[ptr+1] = m4[13];
  data[ptr+2] = m4[14];


  // todo , may we assume scale == 1 ?
  var sx = Math.sqrt( m4[0]*m4[0] + m4[1]*m4[1] + m4[2]*m4[2] );
  var sy = Math.sqrt( m4[4]*m4[4] + m4[5]*m4[5] + m4[6]*m4[6] );
  var sz = Math.sqrt( m4[8]*m4[8] + m4[9]*m4[9] + m4[10]*m4[10] );

  M3[0] = m4[0] / sx;
  M3[1] = m4[1] / sx;
  M3[2] = m4[2] / sx;

  M3[3] = m4[4] / sy;
  M3[4] = m4[5] / sy;
  M3[5] = m4[6] / sy;

  M3[6] = m4[8] / sz;
  M3[7] = m4[9] / sz;
  M3[8] = m4[10]/ sz;

  quatFromMat3( data, ptr+3, M3 );

}

function quatFromMat3(out, ptr, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[ptr+3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[ptr+0] = (m[5]-m[7])*fRoot;
        out[ptr+1] = (m[6]-m[2])*fRoot;
        out[ptr+2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] ){
          i = 1;
        }
        if ( m[8] > m[i*3+i] ){
          i = 2;
        }
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[ptr+i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[ptr+3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[ptr+j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[ptr+k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
}



module.exports = SkeletonAnimation;

