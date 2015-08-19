
var awdjs = require( 'libawd' ),

    AwdString    = awdjs.awdString,
    Consts       = awdjs.consts,
    BaseElement  = awdjs.BaseElement,
    // Properties   = awdjs.properties,
    UserAttr     = awdjs.userAttr;


var ExtInfos     = require( 'optx/extInfos' );


var COMPONENTS = [
  "r",
  "g",
  "b",
  "a"
];

var MASKS = {
  r : 0,
  g : 1,
  b : 2,
  a : 3
};


function decodeSwizzle( u8 ){
  var code3 = 3 & (u8 >>> 6);
  var code2 = 3 & (u8 >>> 4);
  var code1 = 3 & (u8 >>> 2);
  var code0 = 3 & (u8);

  var maskStr;

  if( code2 === code3 ) {
    if( code1 === code3 ) {
      if( code0 === code3 ) {
        maskStr = COMPONENTS[code0];
      } else {
        maskStr = COMPONENTS[code0]+COMPONENTS[code1];
      }
    } else {
      maskStr = COMPONENTS[code0]+COMPONENTS[code1]+COMPONENTS[code2];
    }
  } else {
    maskStr = COMPONENTS[code0]+COMPONENTS[code1]+COMPONENTS[code2]+COMPONENTS[code3];
  }
  return maskStr;
}


function encodeSwizzle( str ){

  if( CONFIG_WRITE ) {
    var chars = str.split( '' );

    while( chars.length > 1 && chars[chars.length-1] === chars[chars.length-2] ){
      chars.pop();
    }
    var res = 0;
    var last;

    for( var i = 0; i< chars.length; i++ ){

      last = MASKS[chars[i]];
      res |= ( last << (i*2) );
    }

    for( ; i<4;i++){
      res |= ( last << (i*2) );
    }

    return res;

  }

}



var CompositeTexture = BaseElement.createStruct( ExtInfos.OPTX_COMPOSITE_TEXTURE, ExtInfos.URI,

{

  init : function( ){

    this.model = Consts.MODEL_TEXTURE;

    this.name       =  '';
    this.extras = new UserAttr();

    this.components = null;

  },


  read : function( reader ){

    this.name = AwdString.read( reader );

    var numComps = reader.U8();

    this.components = [];
    for( var i = 0; i < numComps; i++){
      this.components.push({
        out : decodeSwizzle( reader.U8() ),
        comps : decodeSwizzle( reader.U8() ),
        tex : reader.U32()
      });
    }

    this.extras.read( reader );

  },



  write : ( CONFIG_WRITE ) ?
  function( writer ) {

    AwdString.write( this.name, writer );

    encodeSwizzle('rgb');
    var isEmbed = this.embedData !== null;

    var flags = +(isEmbed);

    writer.U8( flags );

    if( isEmbed ){
      writer.U32(   this.embedData.length );
      writer.writeSub( this.embedData );
    }
    else if( this.uri !== null ) {
      AwdString.write( this.uri, writer );
    }
    else {
      throw new Error( 'Texture have no embedData nor uri');
    }

    this.extras.write( writer );

  }:undefined,




  getDependencies : function(){
    return null;
  },


  toString : function(){
    return "[Texture " + this.name + "]";
  }



} );

module.exports = CompositeTexture;
