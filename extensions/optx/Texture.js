
var awdjs = require( 'optx/_awdlib' ).get(),

    AwdString    = awdjs.awdString,
    Consts       = awdjs.consts,
    BaseElement  = awdjs.BaseElement,
    // Properties   = awdjs.properties,
    UserAttr     = awdjs.userAttr;


var ExtInfos     = require( 'optx/extInfos' );
var FileData     = require( 'optx/FileData' );




var Texture = BaseElement.createStruct( ExtInfos.OPTX_TEXTURE, ExtInfos.URI,

{

  init : function( ){

    this.model = Consts.MODEL_TEXTURE;

    this.name       =  '';
    this.extras = new UserAttr();

    this.fileData  = null;
    this.uri        = null;

  },


  read : function( reader ){

    this.name = AwdString.read( reader );

    var flags = reader.U8();

    var embed = !!(flags & 1);

    if( embed ) {
      this.fileData = new FileData();
      this.fileData.read( reader );
    } else {
      this.uri = AwdString.read( reader );
    }

    this.extras.read( reader );

  },



  write : ( CONFIG_WRITE ) ?
  function( writer ) {

    AwdString.write( this.name, writer );


    var isEmbed = this.fileData !== null;

    var flags = +(isEmbed);

    writer.U8( flags );

    if( isEmbed ){
      this.fileData.write( writer );
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

module.exports = Texture;
