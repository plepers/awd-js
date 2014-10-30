/* jshint -W020 */
var Header        = require( './header' ),
    Writer        = require( './writer' ),
    Consts        = require( './consts' ),
    Block         = require( './block' ),
    BufferReader  = require( "./bufferReader" );


var DefaultStruct = require( './structs/DefaultStruct' ),
    Metadata      = require( './structs/Metadata' ),
    Container     = require( './structs/Container' ),
    Mesh          = require( './structs/Mesh' ),
    Texture       = require( './structs/Texture' ),
    Namespace     = require( './structs/Namespace' ),
    Geometry      = require( './structs/Geometry' );

var AWD = function(){

  this.header = new Header();

  this._blocks = [];
  this._blocksById = [];

  this._extensions = [];

};


AWD.prototype = {


  addBlock : function( block ){
    this._blocks.push( block );
    this._blocksById[ block.id ] = block;
  },

  // =======================
  // IO


  parse : function( buffer ){

    var reader = new BufferReader( buffer ),
        block;

    this.header.read( reader );

    while( reader.bytesAvailable() > 0 ) {
      block = this.parseBlock( reader );
    }

  },

  write : function() {
    return Writer.write( this );
  },

  // =======================
  // Extensions

  registerNamespace : function( namespace ){
    var ext = this.getExtension( namespace.uri );
    if( ext ) {
      ext.nsId = namespace.id;
    }
  },


  addExtension : function( ext ){

    if( this.getExtension( ext.nsUri ) === null ){
      var extLen = this._extensions.push( ext );
      var ns = ext.createNamespace();
      ns.id = ext.nsId = extLen + 1;
      // should be added only if used
      // by some blocks
      this.addBlock( ns.createBlock() );
    }

  },


  getExtension : function( nsUri ){

    var exts = this._extensions;

    for (var i = 0, l = exts.length; i < l; i++) {
      if( exts[i].nsUri === nsUri ){
        return exts[i];
      }
    }
    return null;
  },


  getExtensionById : function( nsId ){

    var exts = this._extensions;

    for (var i = 0, l = exts.length; i < l; i++) {
      if( exts[i].nsId === nsId ){
        return exts[i];
      }
    }
    return null;
  },


  // Model
  // =======================


  getDatasByType : function( type, nsUri, res ){

    if( nsUri === undefined ){
      nsUri = null;
    }
    if( res === undefined ){
      res = [];
    }
    var i, l;
    if( type instanceof Array ) {
      for ( i = 0, l = type.length; i < l; i++) {
        this.getDatasByType( type[i], nsUri, res );
      }
    }
    else {

      for ( i = 0, l = this._blocks.length; i < l; i++) {

        if( this._blocks[i].data.type === type && this._blocks[i].data.nsUri === nsUri ){
          res.push( this._blocks[i].data );
        }
      }

    }


    return res;
  },

  getAssetByID : function( assetID, assetTypesToGet ) {

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


  parseBlock : function( reader ){

    var block = new Block();
    block.read( reader );

    block.data = this.structFactory( block );

    var p = reader.ptr;

    block.data.read( reader );

    if( reader.ptr - p !== block.size ){
      console.log( "Warn bad block parsing , byte delta : ", reader.ptr - p - block.size );
      reader.ptr = p+block.size;
    }

    // if block is a namespace
    // we register it now to resolve
    // folowing blocks
    if( block.ns === Consts.DEFAULT_NS && block.type === Consts.NAMESPACE ){
      this.registerNamespace( block.data );
    }

    this.addBlock( block );

  },


  structFactory : function( block ){

    var struct;

    if( block.ns !== Consts.DEFAULT_NS ) {
      var ext = this.getExtensionById( block.ns );
      if( ext ) {
        struct =  ext.create( block.type );
      }


    } else {

      var type = block.type;

      switch( type ) {
        case Metadata.TYPE :
          struct = new Metadata();
          break;
        case Container.TYPE :
          struct = new Container();
          break;
        case Mesh.TYPE :
          struct = new Mesh();
          break;
        case Geometry.TYPE :
          struct = new Geometry();
          break;
        case Texture.TYPE :
          struct = new Texture();
          break;
        case Namespace.TYPE :
          struct = new Namespace();
          break;
        default :
          struct = new DefaultStruct();
      }

    }

    struct._setup( this, block );

    return struct;

  }



};

module.exports = AWD;
