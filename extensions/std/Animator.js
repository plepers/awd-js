(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "types/properties" ),
      AwdString   = require( "types/awdString" ),
      Consts      = require( "consts" ),
      UserAttr    = require( "types/userAttr" ),
      BaseElement = require( 'BaseElement' );

  var Animator = BaseElement.createStruct( Consts.ANIMATOR, null,

  {

    init : function( ){
      this.name = "";
      this.model      = Consts.MODEL_ANIMATOR;
      this.extras        = new UserAttr();
      this.animatorProps = new UserAttr();

      // skeleton address if type is 1
      this.animatorProps  = new Properties({1 : Consts.AWD_FIELD_BADDR});
      this.props          = new Properties({});


      this.targets      = [];
      this.skeleton     = null;
      this.animationSet = null;
      this.activeState  = 0;
      this.autoPlay     = false;
    },


    read : function( reader ){
      var match;

      this.name = AwdString.read( reader );

      var type = reader.U16();

      // read a skeleton address if type is skeleton
      this.animatorProps.read( reader );

      var animSetId = reader.U32();

      var numTarget = reader.U16();
      
      this.targets = [];
      
      for (var i = 0; i < numTarget; i++) {
        var tgtId = reader.U32();
        match = this.awd.getAssetByID( tgtId, [ Consts.MODEL_MESH ] );
        if( match[0] ){
          this.targets.push( match[1] );
        } else {
          throw new Error('Animator cannot find target reference' ); 
        }

      }


      this.activeState = reader.U16();
      this.autoPlay = (reader.U8() !== 0 );

      this.props.read( reader );
      this.extras.read( reader );




      match = this.awd.getAssetByID( animSetId, [ Consts.MODEL_ANIMATION_SET ] );
      if( match[0] ){
        this.animationSet = match[1];
      } else {
        throw new Error('Animator cannot find AnimationSet reference' ); 
      }

      if( type === 1 ){
        // sekelton animator
        var skeletonId = this.animatorProps.get( 1, 0 );
        match = this.awd.getAssetByID( skeletonId, [ Consts.MODEL_SKELETON ] );
        if( match[0] ){
          this.skeleton = match[1];
        } else {
          throw new Error('Animator cannot find Skeleton reference' ); 
        }
      }
      

    },


    write : ( CONFIG_WRITE ) ?
    function( writer ) {

      AwdString.write( this.name, writer );

      // skeleton only for now
      writer.U16( 1 );
      
      this.animatorProps.set( 1, this.skeleton.chunk.id );
      this.animatorProps.write( writer );

      writer.U32( this.animationSet.chunk.id );
      writer.U16( this.targets.length );

      for (var i = 0; i < this.targets.length; i++) {
         writer.U32( this.targets[i].chunk.id );
      }

      writer.U16( this.activeState );
      writer.U8( this.autoPlay?1:0 );


      this.props .write( writer );
      this.extras.write( writer );


    }:undefined,


    getDependencies : function(){
      var res = [
        this.skeleton,
        this.animationSet
      ];

      for (var i = 0; i < this.targets.length; i++) {
         res.push( this.targets[i] );
      }

      return res;
    },


    toString : function(){
      return '[Animator' + this.name + ']';
    }


  } );





  module.exports = Animator;

}());