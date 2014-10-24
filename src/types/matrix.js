(function () {

  var Polys       = require( "polys" ),
      PMatrix     = Polys.Matrix4;


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
      this.writeMatrix43RawData( writer, this.data );
    },


    toPolysData : function(){
      var res = new PMatrix(),
          rdata = res.data,
          data = this.data;
      for (var i = 0; i < 16; i++) {
        rdata[i] = data[i];
      }
      return res;
    },


    fromPolysData : function( pdata ){
      var rdata = pdata.data,
          data  = this.data;
      for (var i = 0; i < 16; i++) {
        data[i] = rdata[i];
      }
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
    },


    writeMatrix43RawData : function( writer, data )
    {

      var mtx_raw = data;
      var write_func = this.accuracy ? writer.F64 : writer.F32;

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

    }

  };


  module.exports = Matrix3D;

}());