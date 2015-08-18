(function () {


  var Matrix3D = function() {
    this.data = [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ];
  };

  Matrix3D.prototype = {


    read : function( awd, reader )
    {
      this.parseMatrix43RawData( awd, reader, this.data );
    },


    write : ( CONFIG_WRITE ) ?
    function( awd, writer )
    {
      this.writeMatrix43RawData( awd, writer, this.data );
    }:undefined,




    parseMatrix43RawData : function( awd, reader, data )
    {
      var mtx_raw = data;
      var read_func = awd.header.accuracyMatrix ? reader.F64 : reader.F32;

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
    },


    writeMatrix43RawData : ( CONFIG_WRITE ) ?
    function( awd, writer, data )
    {

      var mtx_raw = data;
      var write_func = awd.header.accuracyMatrix ? writer.F64 : writer.F32;

      write_func.call( writer, mtx_raw[0]  );
      write_func.call( writer, mtx_raw[1]  );
      write_func.call( writer, mtx_raw[2]  );
      write_func.call( writer, mtx_raw[4]  );
      write_func.call( writer, mtx_raw[5]  );
      write_func.call( writer, mtx_raw[6]  );
      write_func.call( writer, mtx_raw[8]  );
      write_func.call( writer, mtx_raw[9]  );
      write_func.call( writer, mtx_raw[10] );
      write_func.call( writer, mtx_raw[12] );
      write_func.call( writer, mtx_raw[13] );
      write_func.call( writer, mtx_raw[14] );

    }:undefined

  };


  module.exports = Matrix3D;

}());