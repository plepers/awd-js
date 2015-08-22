(function () {

  var Consts = require( "consts" );

  var Header = function() {

    this.size = 12;

    this.version = {
      major : 0,
      minor : 0
    };

    this.streaming        = false;

    this.accuracyMatrix   = false;
    this.accuracyGeo      = false;
    this.accuracyProps    = false;

    this.geoNrType                 = Consts.FLOAT32;
    this.matrixNrType              = Consts.FLOAT32;
    this.propsNrType               = Consts.FLOAT32;

    this.optimized_for_accuracy    = false;
    this.compression               = false;
    this.bodylen                   = 0;

  };

  Header.prototype = {

    read : function( reader )
    {

      var magic =
            ( reader.U8()<<16)
        |   ( reader.U8()<<8 )
        |     reader.U8();

      if( magic !== Consts.MAGIC ) {
        throw new Error( "AWD parse error - bad magic "+ magic.toString(16) );
      }

      var v = this.version;
      v.major = reader.U8();
      v.minor = reader.U8();


      var flags = reader.U16();

      this.streaming                = (flags & 0x1) === 0x1;
      this.optimized_for_accuracy   = (flags & 0x2) === 0x2;

      if ((v.major === 2) && (v.minor === 1)) {
        this.accuracyMatrix =  (flags & 0x2) === 0x2;
        this.accuracyGeo    =  (flags & 0x4) === 0x4;
        this.accuracyProps  =  (flags & 0x8) === 0x8;
      }


      this.geoNrType       = this.accuracyGeo     ? Consts.FLOAT64 : Consts.FLOAT32;
      this.matrixNrType    = this.accuracyMatrix  ? Consts.FLOAT64 : Consts.FLOAT32;
      this.propsNrType     = this.accuracyProps   ? Consts.FLOAT64 : Consts.FLOAT32;


      this.compression = reader.U8();
      this.bodylen = reader.U32();

    },

    write : ( CONFIG_WRITE ) ?
    function( writer )
    {
      // Magic
      writer.U8( 0x41 );
      writer.U8( 0x57 );
      writer.U8( 0x44 );

      writer.U8( this.version.major );
      writer.U8( this.version.minor );

      var flags =
        ( this.streaming                  ? 1    : 0 ) |
        ( this.accuracyMatrix             ? 1<<1 : 0 ) |
        ( this.accuracyGeo                ? 1<<2 : 0 ) |
        ( this.accuracyProps              ? 1<<3 : 0 );

      writer.U16( flags );

      writer.U8( this.compression );
      writer.U32( this.bodylen );
    }:undefined,


  };


  module.exports = Header;

}());