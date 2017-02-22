
var BaseElement  = require( '../BaseElement' ),
    UserAttr     = require( '../types/userAttr' ),
    AwdString    = require( '../types/awdString' ),
    Consts       = require( '../consts' );


var ExtInfos     = require( './extInfos' );


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

  resolveTexture: function( id ){
    var match = this.awd.getAssetByID( id, [ Consts.MODEL_TEXTURE ] );
    if ( match[0] ) {
      return match[1];
    }
    throw new Error("Could not find referenced Texture for this CompositeTexture, uid : "+id);
  },


  read : function( reader ){

    this.name = AwdString.read( reader );

    var numComps = reader.U8();

    this.components = [];
    for( var i = 0; i < numComps; i++){
      this.components.push({
        out : decodeSwizzle( reader.U8() ),
        comps : decodeSwizzle( reader.U8() ),
        tex : this.resolveTexture( reader.U32() )
      });
    }

    this.extras.read( reader );

  },

  assertValid : function(){
    if( this.components == null ){
      throw new Error("CompositeTexture.write -  components are not defined");
    }
  },


  write : ( CONFIG_WRITE ) ?
  function( writer ) {

    AwdString.write( this.name, writer );

    this.assertValid();

    var numComps = this.components.length;
    writer.U8( numComps );

    for( var i = 0; i < numComps; i++){
      var comp = this.components[i];
      writer.U8( encodeSwizzle( comp.out ) );
      writer.U8( encodeSwizzle( comp.comps ) );
      writer.U32( comp.tex.chunk.id );
    }

    this.extras.write( writer );

  }:undefined,




  getDependencies : function(){
    this.assertValid();
    return this.components.map( function( comp ){
      return comp.tex;
    });
  },


  toString : function(){
    return "[CompositeTexture " + this.name + "]";
  }



} );

module.exports = CompositeTexture;
