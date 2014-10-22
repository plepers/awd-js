
module.exports = {

  read : function( reader ) {
    var l = reader.U16();
    return reader.readUTFBytes( l );
  }


};