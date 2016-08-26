(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "types/properties" ),
      AwdString   = require( "types/awdString" ),
      Consts      = require( "consts" ),
      UserAttr    = require( "types/userAttr" ),
      BaseElement = require( 'BaseElement' );

  var AnimationSet = BaseElement.createStruct( Consts.ANIMATION_SET, null,

  {

    init : function( ){
      this.name = "";
      this.model = Consts.MODEL_ANIMATION_SET;
      this.extras = new UserAttr();
      this.props = new Properties({});
      this.animations = [];
    },


    read : function( reader ){
      this.name = AwdString.read( reader );

      var numAnims = reader.U16();
      
      // todo , for skeletons, prop contain bonesPerVertex info
      this.props.read( reader );

      this.animations = [];
      var animation;
      
      for (var i = 0; i < numAnims; i++) {
        var animId = reader.U32();
        var match = this.awd.getAssetByID( animId, [ Consts.MODEL_ANIMATION_STATE ] );
        if( match[0] ){
          animation = match[1];
        } else {
          throw new Error('AnimationSet cannot find animation state reference' ); 
        }

        this.animations.push( animation );
      }

      this.extras.read( reader );

    },


    write : ( CONFIG_WRITE ) ?
    function( writer ) {

      AwdString.write( this.name, writer );

      writer.U16( this.animations.length );
      
      // todo , for skeletons, prop contain bonesPerVertex info
      this.props.write( writer );

      for (var i = 0; i < this.animations.length; i++) {
         writer.U32( this.animations[i].chunk.id );
      }

      this.extras.write( writer );

    }:undefined,


    getDependencies : function(){
      var res = [];

      var fl = this.animations.length;

      for (var i = 0; i < fl; i++) {
        var anim = this.animations[i];
        res.push( anim );
      }

      return res;
    },


    toString : function(){
      return '[AnimationSet' + this.name + ']';
    }


  } );





  module.exports = AnimationSet;

}());