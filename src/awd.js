/* jshint -W020 */
var Header    = require( './header' ),
    Parser    = require( './parser' ),
    Writer    = require( './writer' ),
    Consts    = require( './consts' );

var DefaultStruct = require( './structs/DefaultStruct' ),
    Metadata      = require( './structs/Metadata' ),
    Container     = require( './structs/Container' ),
    Mesh          = require( './structs/Mesh' ),
    Texture       = require( './structs/Texture' ),
    Geometry      = require( './structs/Geometry' );

var AWD = function(){

  this.header = new Header();

  this._blocks = [];
  this._blocksById = [];

  this.namespacedFactories = {};

};


AWD.prototype = {

  addFactory : function( ns, facto ){
    this.namespacedFactories[ns] = facto;
  },

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

  getDatasByType : function( type, ns ){
    if( ns === undefined ){
      ns = Consts.DEFAULT_NS;
    }
    var res = [];
    for (var i = 0, l = this._blocks.length; i < l; i++) {
      if( this._blocks[i].data.type === type && this._blocks[i].data.ns === ns ){
        res.push( this._blocks[i].data );
      }
    }
    return res;
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
  },

  structFactory : function( block ){

    if( block.ns !== Consts.DEFAULT_NS ) {
      var struct;
      var facto = this.namespacedFactories[block.ns];

      if( facto ) {
        struct =  facto( block );
      }

      if( !struct ) {
        struct = new DefaultStruct( block );
      }

      return struct;
    }

    var type = block.type;

    switch( type ) {
      case Metadata.TYPE :
        return new Metadata();
      case Container.TYPE :
        return new Container();
      case Mesh.TYPE :
        return new Mesh();
      case Geometry.TYPE :
        return new Geometry();
      case Texture.TYPE :
        return new Texture();
      default :
        return new DefaultStruct( block );
    }

  }



};

module.exports = AWD;
