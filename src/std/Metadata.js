(function(){


  var Consts      = require( "../consts" ),
      Properties  = require( "../types/properties" ),
      BaseElement  = require( '../BaseElement' );

  var DEFAULT = "unknown";

  var Metadata = BaseElement.createStruct( Consts.METADATA, null,

  {

    init : function( ){
      this.timeStamp        = 0;
      this.encoderName      = DEFAULT;
      this.encoderVersion   = DEFAULT;
      this.generatorName    = DEFAULT;
      this.generatorVersion = DEFAULT;
    },


    read : function( reader ){

      var props = new Properties({
        1:Consts.AWD_FIELD_UINT32,
        2:Consts.AWD_FIELD_STRING,
        3:Consts.AWD_FIELD_STRING,
        4:Consts.AWD_FIELD_STRING,
        5:Consts.AWD_FIELD_STRING
      });

      props.read( reader );

      this.timeStamp        = props.get( 1, 0 );
      this.encoderName      = props.get( 2, DEFAULT );
      this.encoderVersion   = props.get( 3, DEFAULT );
      this.generatorName    = props.get( 4, DEFAULT );
      this.generatorVersion = props.get( 5, DEFAULT );

    },


    write : function( writer ) {
      var props = new Properties({
        1:Consts.AWD_FIELD_UINT32,
        2:Consts.AWD_FIELD_STRING,
        3:Consts.AWD_FIELD_STRING,
        4:Consts.AWD_FIELD_STRING,
        5:Consts.AWD_FIELD_STRING
      });

      props.set( 1, this.timeStamp );
      props.set( 2, this.encoderName      );
      props.set( 3, this.encoderVersion   );
      props.set( 4, this.generatorName    );
      props.set( 5, this.generatorVersion );

      props.write( writer );
    },

    toString : function(){

      return("Metadata : TimeStamp         = " + this.timeStamp +
                       " EncoderName       = " + this.encoderName +
                       " EncoderVersion    = " + this.encoderVersion +
                       " GeneratorName     = " + this.generatorName +
                       " GeneratorVersion  = " + this.generatorVersion );

    }



  } );


  module.exports = Metadata;

}());