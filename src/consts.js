(function ( AWD ) {


  var Consts = {};

  Consts.UNCOMPRESSED  = 0;
  Consts.DEFLATE       = 1;
  Consts.LZMA          = 2;

  Consts.AWD_FIELD_INT8      = 1;
  Consts.AWD_FIELD_INT16     = 2;
  Consts.AWD_FIELD_INT32     = 3;
  Consts.AWD_FIELD_UINT8     = 4;
  Consts.AWD_FIELD_UINT16    = 5;
  Consts.AWD_FIELD_UINT32    = 6;
  Consts.AWD_FIELD_FLOAT32   = 7;
  Consts.AWD_FIELD_FLOAT64   = 8;
  Consts.AWD_FIELD_BOOL      = 21;
  Consts.AWD_FIELD_COLOR     = 22;
  Consts.AWD_FIELD_BADDR     = 23;
  Consts.AWD_FIELD_STRING    = 31;
  Consts.AWD_FIELD_BYTEARRAY = 32;
  Consts.AWD_FIELD_VECTOR2x1 = 41;
  Consts.AWD_FIELD_VECTOR3x1 = 42;
  Consts.AWD_FIELD_VECTOR4x1 = 43;
  Consts.AWD_FIELD_MTX3x2    = 44;
  Consts.AWD_FIELD_MTX3x3    = 45;
  Consts.AWD_FIELD_MTX4x3    = 46;
  Consts.AWD_FIELD_MTX4x4    = 47;

  Consts.BOOL       = 21;
  Consts.COLOR      = 22;
  Consts.BADDR      = 23;



  Consts.INT8    = 1;
  Consts.INT16   = 2;
  Consts.INT32   = 3;
  Consts.UINT8   = 4;
  Consts.UINT16  = 5;
  Consts.UINT32  = 6;
  Consts.FLOAT32 = 7;
  Consts.FLOAT64 = 8;


  Consts.AWDSTRING    = 31;
  Consts.AWDBYTEARRAY = 32;

  Consts.MAGIC   = 4282180;


  AWD.Consts = Consts;

}( AWD ));