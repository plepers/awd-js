/* jshint -W020 */
AWD = function(){

  this.header = new AWD.Header();

  this._blocks = [];
  this._blocksById = [];

};


AWD.prototype = {

  addBlock : function( block ){
    this._blocks.push( block );
    this._blocksById[ block.id ] = block;
  },

  parse : function( buffer ){
    AWD.Parser.parse( buffer, this );
  },

  makeMatrix3D : function() {
    return new AWD.Matrix3D( this.header.accuracyMatrix );
  },

  getAssetByID : function( assetID, assetTypesToGet, extraTypeInfo )
    {
      var returnArray = [],
          typeCnt = 0,
          _blocks = this._blocksById;

      if (assetID > 0) {

        if ( _blocks[assetID] && _blocks[assetID].data ) {

          while ( typeCnt < assetTypesToGet.length ) {

            if ( _blocks[assetID].data instanceof assetTypesToGet[typeCnt] ) {
              //if the right assetType was found
              if ( ( assetTypesToGet[typeCnt] === AWD.Texture ) && (extraTypeInfo === "CubeTexture" ) ) {

                if ( _blocks[assetID].data instanceof AWD.BitmapCubeTexture ) {
                  returnArray.push( true );
                  returnArray.push( _blocks[assetID].data );
                  return returnArray;
                }

              }

              if ( ( assetTypesToGet[typeCnt] === AWD.Texture ) && (extraTypeInfo === "SingleTexture" ) ) {

                if (_blocks[assetID].data instanceof AWD.BitmapTexture ) {
                  returnArray.push( true );
                  returnArray.push( _blocks[assetID].data );
                  return returnArray;
                }

              } else {
                returnArray.push( true );
                returnArray.push( _blocks[assetID].data );
                return returnArray;

              }
            }

            if ((assetTypesToGet[typeCnt] === AWD.Geometry ) && ( _blocks[assetID].data instanceof AWD.Mesh )) {
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
