
var Header        = require( './header' ),
    Writer        = require( './writer' ),
    Consts        = require( './consts' ),
    Chunk         = require( './chunk' ),
    BufferReader  = require( './bufferReader' ),
    DefaultElement = require( './DefaultElement' );


var AWD = function(){

  this.header = new Header();

  this._elements = [];
  this._elementsById = [];
  this._extensions = [];

};


AWD.prototype = {


  addElement : function( element ){
    this._elements.push( element );
    this._elementsById[ element.id ] = element;
  },

  removeElement : function( element ){
    var index = this._elements.indexOf( element );
    if( index > -1 ){
      this._elements.splice( index, 1 );
    }
  },


  // =======================
  // IO


  parse : function( buffer ){

    var reader = new BufferReader( buffer ),
        chunk;

    this.header.read( reader );

    while( reader.bytesAvailable() > 0 ) {
      chunk = this.parseChunk( reader );
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
        // by some elements
        this.addElement( ns );
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

      for ( i = 0, l = this._elements.length; i < l; i++) {

        if( this._elements[i].type === type && this._elements[i].nsUri === nsUri ){
          res.push( this._elements[i] );
        }
      }

    }


    return res;
  },

  getAssetByID : function( assetID, assetTypesToGet ) {

    var returnArray = [],
        typeCnt = 0,
        _elements = this._elementsById;

    if (assetID > 0) {

      if ( _elements[assetID] ) {

        while ( typeCnt < assetTypesToGet.length ) {

          if ( (_elements[assetID].model & assetTypesToGet[typeCnt]) !== 0) {

            returnArray.push( true );
            returnArray.push( _elements[assetID] );
            return returnArray;

          }

          if ((assetTypesToGet[typeCnt] === Consts.MODEL_GEOMETRY ) && ( (_elements[assetID].model & Consts.MODEL_MESH) !== 0)) {
            returnArray.push( true );
            returnArray.push( _elements[assetID].geometry );
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


  parseChunk : function( reader ){

    var chunk = new Chunk();
    chunk.read( reader );

    var data = this.structFactory( chunk );

    var p = reader.ptr;

    data.read( reader );

    if( reader.ptr - p !== chunk.size ){
      console.log( "Warn bad block parsing , byte delta : ", reader.ptr - p - chunk.size );
      reader.ptr = p+chunk.size;
    }

    // if chunk is a namespace
    // we register it now to resolve
    // folowing elements
    if( chunk.ns === Consts.DEFAULT_NS && chunk.type === Consts.NAMESPACE ){
      this.registerNamespace( data );
    }

    this.addElement( data );

  },


  structFactory : function( chunk ){

    var struct;

    var ext = this.getExtensionById( chunk.ns );
    if( ext ) {
      struct =  ext.create( chunk.type );
    } else {
      struct = new DefaultElement();
    }

    struct._setup( this, chunk );

    return struct;

  },

  resolveNamespace : function( elem ){

    if( elem.nsUri == null ) {
      return 0;
    }

    var ext = this.getExtension( elem.nsUri );
    if( ext ){
      return ext.nsId;
    } else {
      console.log( "Missing extension "+ elem.nsUri );
    }

    return 0;
  }



};

module.exports = AWD;
