
var Header        = require( './header' ),
    Writer        = require( './writer' ),
    Consts        = require( './consts' ),
    Block         = require( './block' ),
    BufferReader  = require( './bufferReader' ),
    DefaultStruct = require( './std/DefaultStruct' ),
    stdExt        = require( './stdExt' );


var AWD = function(){

  this.header = new Header();

  this._blocks = [];
  this._blocksById = [];
  this._extensions = [];

  // add the default extension
  this.addExtension( stdExt() );

};


AWD.prototype = {


  addBlock : function( block ){
    this._blocks.push( block );
    this._blocksById[ block.id ] = block;
  },

  removeBlock : function( block ){
    var index = this._blocks.indexOf( block );
    if( index > -1 ){
      this._blocks.splice( index, 1 );
    }
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
      ext.nsId = namespace.nsId;
    }
  },


  addExtension : function( ext ){

    if( this.getExtension( ext.nsUri ) === null ){
      var extLen = this._extensions.push( ext );
      var ns = ext.createNamespace();

      var id;

      // non default namespace
      if( ext.nsUri !== null )
      {
        id = extLen + 1;
        // should be added only if used
        // by some blocks
        this.addBlock( ns );
      }
      else
      {
        id = 0;
      }

      ns.nsId = ext.nsId = id;

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

        if( this._blocks[i].type === type && this._blocks[i].nsUri === nsUri ){
          res.push( this._blocks[i] );
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

      if ( _blocks[assetID] ) {

        while ( typeCnt < assetTypesToGet.length ) {

          if ( (_blocks[assetID].model & assetTypesToGet[typeCnt]) !== 0) {

            returnArray.push( true );
            returnArray.push( _blocks[assetID] );
            return returnArray;

          }

          if ((assetTypesToGet[typeCnt] === Consts.MODEL_GEOMETRY ) && ( (_blocks[assetID].model & Consts.MODEL_MESH) !== 0)) {
            returnArray.push( true );
            returnArray.push( _blocks[assetID].geometry );
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

    var data = this.structFactory( block );

    var p = reader.ptr;

    data.read( reader );

    if( reader.ptr - p !== block.size ){
      console.log( "Warn bad block parsing , byte delta : ", reader.ptr - p - block.size );
      reader.ptr = p+block.size;
    }

    // if block is a namespace
    // we register it now to resolve
    // folowing blocks
    if( block.ns === Consts.DEFAULT_NS && block.type === Consts.NAMESPACE ){
      this.registerNamespace( data );
    }

    this.addBlock( data );

  },


  structFactory : function( block ){

    var struct;

    var ext = this.getExtensionById( block.ns );
    if( ext ) {
      struct =  ext.create( block.type );
    } else {
      struct = new DefaultStruct();
    }

    struct._setup( this, block );

    return struct;

  },

  resolveNamespace : function( struct ){
    // Generic specific

    var ext = this.getExtension( struct.nsUri );
    if( ext ){
      return ext.nsId;
    } else {
      console.log( "Missing extension "+ struct.nsUri );
    }

    return 0;
  }



};

module.exports = AWD;
