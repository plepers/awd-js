(function () {


  var Matrix3D = function( accuracy ) {
    this.data = [];
    this.accuracy = accuracy;
  };

  Matrix3D.prototype = {

    read : function( reader )
    {
      this.parseMatrix43RawData( reader, this.data );
    },

    write : function( writer )
    {
      writer.xx();
    },

    parseMatrix43RawData : function( reader, data )
    {
      var mtx_raw = data;
      var read_func = this.accuracy ? reader.F64 : reader.F32;

      mtx_raw[0]  = read_func.call(reader);
      mtx_raw[1]  = read_func.call(reader);
      mtx_raw[2]  = read_func.call(reader);
      mtx_raw[3]  = 0.0;
      mtx_raw[4]  = read_func.call(reader);
      mtx_raw[5]  = read_func.call(reader);
      mtx_raw[6]  = read_func.call(reader);
      mtx_raw[7]  = 0.0;
      mtx_raw[8]  = read_func.call(reader);
      mtx_raw[9]  = read_func.call(reader);
      mtx_raw[10] = read_func.call(reader);
      mtx_raw[11] = 0.0;
      mtx_raw[12] = read_func.call(reader);
      mtx_raw[13] = read_func.call(reader);
      mtx_raw[14] = read_func.call(reader);
      mtx_raw[15] = 1.0;

      //TODO: fix max exporter to remove NaN values in joint 0 inverse bind pose
      if (isNaN(mtx_raw[0])) {
        mtx_raw[0] = 1;
        mtx_raw[1] = 0;
        mtx_raw[2] = 0;
        mtx_raw[4] = 0;
        mtx_raw[5] = 1;
        mtx_raw[6] = 0;
        mtx_raw[8] = 0;
        mtx_raw[9] = 0;
        mtx_raw[10] = 1;
        mtx_raw[12] = 0;
        mtx_raw[13] = 0;
        mtx_raw[14] = 0;

      }

      return mtx_raw;
    }

  };


  module.exports = Matrix3D;

}());