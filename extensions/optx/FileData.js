
var awdjs = require( 'optx/_awdlib' ).get(),
    AwdString    = awdjs.awdString;

function FileData(){
  this.data = null;
  this.mime = 'application/binary';
  this.uri  = '';
}

FileData.prototype.read = function( reader ){
  this.mime    = AwdString.read( reader );
  this.uri     = AwdString.read( reader );
  var data_len = reader.U32();
  this.data    = reader.subArray( data_len );
};

if( CONFIG_WRITE )
{
  FileData.prototype.write = function( writer ){
    AwdString.write( this.mime, writer );
    AwdString.write( this.uri,  writer );
    writer.U32(       this.data.length );
    writer.writeSub(  this.data );
  };
}

module.exports = FileData;