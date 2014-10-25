/* jshint -W020 */
var Header    = require( './header' ),
    Parser    = require( './parser' ),
    Writer    = require( './writer' ),
    Consts    = require( './consts' );

var AWD = function(){

  this.header = new Header();

  this._blocks = [];
  this._blocksById = [];

};


AWD.prototype = {

  addBlock : function( block ){
    this._blocks.push( block );
    this._blocksById[ block.id ] = block;
  },

  parse : function( buffer ){
    Parser.parse( buffer, this );
  },

  write : function() {
    return Writer.write( this );
  },

  getAssetByID : function( assetID, assetTypesToGet )
  {
    var returnArray = [],
        typeCnt = 0,
        _blocks = this._blocksById;

    if (assetID > 0) {

      if ( _blocks[assetID] && _blocks[assetID].data ) {

        while ( typeCnt < assetTypesToGet.length ) {

          if ( (_blocks[assetID].data.model & assetTypesToGet[typeCnt]) !== 0) {

            returnArray.push( true );
            returnArray.push( _blocks[assetID].data );
            return returnArray;

          }

          if ((assetTypesToGet[typeCnt] === Consts.MODEL_GEOMETRY ) && ( (_blocks[assetID].data.model & Consts.MODEL_MESH) !== 0)) {
            returnArray.push( true );
            returnArray.push( _blocks[assetID].data.geometry );
            return returnArray;
          }
          typeCnt++;
        }
      }
    }
    // if the function has not returned anything yet, the asset is not found, or the found asset is not the right type.
    returnArray.push(false);
    returnArray.push( null );

    return returnArray;
  }

};

module.exports = AWD;
