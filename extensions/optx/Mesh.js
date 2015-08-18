var awdjs = require( 'libawd' ),

    AwdString    = awdjs.awdString,
    Container   = awdjs.Container,
    Consts       = awdjs.consts,
    BaseElement  = awdjs.BaseElement,
    UserAttr     = awdjs.userAttr,
    Properties   = awdjs.properties;


var ExtInfos     = require( 'optx/extInfos' );


/**
  parent_id ->  U32
  matrix    ->  mat4
  pivot     ->  pivot
  name      ->  AwdString
  geom_id   ->  U32
  props     ->  Properties
  numsubs   ->  U16

  submeshes *
    material:         -> U32
    firstIndex:       -> U32
    indexCount:       -> U32
    firstWireIndex:   -> U32
    wireIndexCount:   -> U32

  extras    -> UserAttr

**/




var PROPS = {
  cullBackFaces : 1,
  castShadows   : 2,
  bounds        : 10
};

var Mesh = BaseElement.createStruct( ExtInfos.OPTX_MESH, ExtInfos.URI,

{

  init : function( ){
    this.model = Consts.MODEL_MESH;

    Container.super( this );

    this.geometry = null;

    this.extras = new UserAttr();

    this.props = new Properties( {
      1  : Consts.AWD_FIELD_BOOL,
      2  : Consts.AWD_FIELD_BOOL,
      10 : Consts.AWD_FIELD_FLOAT32
    } );

    this.submeshes = [];

  },


  read : function( reader ){

    var parent_id   = reader.U32();
    this.matrix.read( this.awd, reader );
    this.pivot.parsePivot( this.awd, reader );

    this.name       = AwdString.read( reader );

    var geom_id     = reader.U32();
    this.props.read( reader );
    var num_subs    = reader.U16();


    for (var i = 0; i < num_subs; i++) {
      var submesh = new SubMesh();
      submesh.read( this.awd, reader );
      this.submeshes.push( submesh );
    }


    this.extras.read( reader );


    /*
      resolves dependancies
      ----------------------
    */
    var match = this.awd.getAssetByID( geom_id, [ Consts.MODEL_GEOMETRY ] );
    if ( match[0] ) {
      this.geometry = match[1];
    } else {
      //throw new Error("Could not find a geometry for this Mesh");
    }

    match = this.awd.getAssetByID(parent_id, [ Consts.MODEL_CONTAINER, Consts.MODEL_MESH, Consts.MODEL_LIGHT, Consts.MODEL_ENTITY, Consts.MODEL_SEGMENT_SET ] );
    if ( match[0] ) {
      // weak dependency w/ other types
      if( match[1].addChild !== undefined ) {
        match[1].addChild( this );
      }

      this.parent = match[1];

    } else if (parent_id > 0) {
      throw new Error("Could not find a parent for this Mesh "+parent_id);
    }

  },



  write : ( CONFIG_WRITE ) ?
  function( writer ) {


    /*
      resolves dependancies
      ----------------------
    */

    var parent_id = 0;
    var parent = this.parent;
    if( parent ) {
      parent_id = parent.chunk.id;
    }

    var geom_id = 0;
    var geom = this.geometry;
    if( geom ) {
      geom_id = geom.chunk.id;
    }



    /*
      write
      ----------------------
    */


    writer.U32( parent_id );
    this.matrix.write( this.awd, writer );
    this.pivot.writePivot( this.awd, writer );
    AwdString.write( this.name, writer );
    writer.U32( geom_id );

    this.props.write( writer );


    var num_subs = this.submeshes.length;
    writer.U16( num_subs );
    for (var i = 0; i < num_subs; i++) {
      var submesh = this.submeshes[i];
      submesh.write( this.awd, writer );
    }

    this.extras.write( writer );

  }:undefined,


  getCullBackFace : function(){
    return this.props.get( PROPS.cullBackFaces, true ) === 1;
  },
  setCullBackFace : function( bool ){
    this.props.set( PROPS.cullBackFaces, bool );
  },



  getCastShadows : function(){
    return this.props.get( PROPS.castShadows, false ) === 1;
  },
  setCastShadows : function( bool ){
    this.props.set( PROPS.castShadows, bool );
  },


  getDependencies : function(){
    var res = [];

    var sublen = this.submeshes.length;

    for (var i = 0; i < sublen; i++) {
      var mat = this.submeshes[i].material;
      if( mat ) {
        res.push( mat );
      }
    }

    if( this.parent ) {
      res.push( this.parent );
    }

    if( this.geometry ) {
      res.push( this.geometry );
    }


    return res;
  },


  toString : function(){
    return "[Mesh " + this.pData.name + "]";
  }



} );


function SubMesh() {

  this.material = null;

  this.firstIndex     = 0;
  this.indexCount     = 0;
  this.firstWireIndex = 0;
  this.wireIndexCount = 0;

}

SubMesh.prototype = {

  read : function( awd, reader ){

    var matId = reader.U32();

    this.firstIndex     = reader.U32();
    this.indexCount     = reader.U32();
    this.firstWireIndex = reader.U32();
    this.wireIndexCount = reader.U32();

    /*
      resolves dependancies
      ----------------------
    */

    var matRes = awd.getAssetByID( matId, [ Consts.MODEL_MATERIAL ] );

    if ((!matRes[0]) && (matId > 0)) {
      throw new Error("Could not find Material (ID = " + matId + " ) for this SubMesh");
    }

    if(matId > 0){
      this.material = matRes[1];
    }

  },

  write : function( awd, writer ){

    /*
      resolves dependancies
      ----------------------
    */

    var matId = 0;
    var mat = this.material;
    if( mat ) {
      matId = mat.chunk.id;
    }


    /*
      write
      ----------------------
    */

    writer.U32( matId );
    writer.U32( this.firstIndex     );
    writer.U32( this.indexCount     );
    writer.U32( this.firstWireIndex );
    writer.U32( this.wireIndexCount );


  }

};

Container.extend( Mesh.prototype );

Mesh.SubMesh = SubMesh;

module.exports = Mesh;