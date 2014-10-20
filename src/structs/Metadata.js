(function(){

  var DEFAULT = "unknown",
      Consts = AWD.Consts;


  var Metadata = function(){
    this.timeStamp        = 0;
    this.encoderName      = DEFAULT;
    this.encoderVersion   = DEFAULT;
    this.generatorName    = DEFAULT;
    this.generatorVersion = DEFAULT;
  };

  Metadata.prototype = {



    read : function( reader ){

      var props = new AWD.Properties({
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
      return writer;
    },

    toString : function(){

      return("Metadata : TimeStamp         = " + this.timeStamp +
                       " EncoderName       = " + this.encoderName +
                       " EncoderVersion    = " + this.encoderVersion +
                       " GeneratorName     = " + this.generatorName +
                       " GeneratorVersion  = " + this.generatorVersion );

    }



  };


  AWD.BaseStruct.extend( Metadata.prototype );

  AWD.Metadata = Metadata;

}());