(function(){

  // var Consts = AWD.Consts;
  var Properties  = require( "types/properties" ),
      AwdString   = require( "types/awdString" ),
      Consts      = require( "consts" ),
      BaseElement = require( 'BaseElement' );

  var Primitive = BaseElement.createStruct( Consts.PRIMITIVE, null,

  {

    init : function( ){
      this.name = "";
      this.model = Consts.MODEL_GEOMETRY;
    },


    read : function( reader ){
      this.name = AwdString.read( reader );
      this.type = reader.U8();

      var props = this._createProps();
      props.read( reader );

      var geom;
      switch( this.type ){
        case 1 :
          geom = this.makePlane( props );
          break;
        case 2 :
          geom = this.makeCube( props );
          break;
        case 3 :
          geom = this.makeSphere( props );
          break;
        case 4 :
          geom = this.makeCylinder( props );
          break;
        case 5 :
          geom = this.makeCone( props );
          break;
        case 6 :
          geom = this.makeCapsule( props );
          break;
        case 7 :
          geom = this.makeTorus( props );
          break;
        default :
          throw new Error( 'unknown primitive type '+ this.type );
      }

      this.geom = geom;

    },



    write : function( writer ) {
      AwdString.write( this.name, writer );
      if( ! this.geom ){
        throw new Error( "Primitive geom is not defined" );
      }

      writer.U8( this.geom._tId );

      var props = this._createProps();

      switch( this.geom.type ){
        case 1 :
          this.setupPropsPlane( this.geom, props );
          break;
        case 2 :
          this.setupPropsCube( this.geom, props );
          break;
        case 3 :
          this.setupPropsSphere( this.geom, props );
          break;
        case 4 :
          this.setupPropsCylinder( this.geom, props );
          break;
        case 5 :
          this.setupPropsCone( this.geom, props );
          break;
        case 6 :
          this.setupPropsCapsule( this.geom, props );
          break;
        case 7 :
          this.setupPropsTorus( this.geom, props );
          break;
        default :
          throw new Error( 'unknown primitive type '+ this.geom.type );
      }

      props.write( writer );

    },


    _createProps : function(){
      var geoNrType = this.awd.header.geoNrType;
      return new Properties({
        101 : geoNrType,
        102 : geoNrType,
        103 : geoNrType,
        110 : geoNrType,
        111 : geoNrType,
        301 : Consts.UINT16,
        302 : Consts.UINT16,
        303 : Consts.UINT16,
        701 : Consts.BOOL,
        702 : Consts.BOOL,
        703 : Consts.BOOL,
        704 : Consts.BOOL
      });
    },

    toString : function(){

    },

    makePlane : function( props ){
      var res = {
        _tId        : 1,
        type        : "plane",
        width       : 100,
        height      : 100,
        segmentsW   : 1,
        segmentsH   : 1,
        yUp         : true,
        doubleSided : false
      };
      if( props ){
        this.setupPlane( res, props );
      }
      return res;
    },

    makeCube : function( props ){
      var res = {
        _tId      : 2,
        type      : "cube",
        width     : 100,
        height    : 100,
        depth     : 100,
        segmentsW : 1,
        segmentsH : 1,
        segmentsD : 1,
        tile6     : true
      };
      if( props ){
        this.setupCube( res, props );
      }
      return res;
    },

    makeSphere : function( props ){
      var res = {
        _tId      : 3,
        type      : "sphere",
        radius    : 100,
        segmentsW : 16,
        segmentsH : 12,
        yUp       : true
      };
      if( props ){
        this.setupSphere( res, props );
      }
      return res;
    },

    makeCylinder : function( props ){
      var res = {
        _tId          : 4,
        type          : "cylinder",
        topRadius     : 50,
        bottomRadius  : 50,
        height        : 100,
        segmentsW     : 16,
        segmentsH     : 1,
        topClosed     : true,
        bottomClosed  : true,
        surfaceClosed : true,
        yUp           : true
      };
      if( props ){
        this.setupCylinder( res, props );
      }
      return res;
    },

    makeCone : function( props ){
      var res = {
        _tId      : 5,
        type      : "cone",
        radius    : 50,
        height    : 100,
        segmentsW : 16,
        segmentsH : 1,
        closed    : true,
        yUp       : true
      };
      if( props ){
        this.setupCone( res, props );
      }
      return res;
    },

    makeCapsule : function( props ){
      var res = {
        _tId      : 6,
        type      : "capsule",
        radius    : 50,
        height    : 100,
        segmentsW : 16,
        segmentsH : 15,
        yUp       : true
      };
      if( props ){
        this.setupCapsule( res, props );
      }
      return res;
    },

    makeTorus : function( props ){
      var res = {
        _tId       : 7,
        type       : "torus",
        radius     : 50,
        tubeRadius : 50,
        segmentsR  : 16,
        segmentsT  : 8,
        yUp        : true
      };
      if( props ){
        this.setupTorus( res, props );
      }
      return res;
    },



    setupPlane : function( obj, props ){
      obj.width       = props.get( 101, 100 );
      obj.height      = props.get( 102, 100 );
      obj.segmentsW   = props.get( 301, 1 );
      obj.segmentsH   = props.get( 302, 1 );
      obj.yUp         = props.get( 701, true );
      obj.doubleSided = props.get( 702, false );
    },

    setupCube : function( obj, props ){
      obj.width     = props.get( 101, 100 );
      obj.height    = props.get( 102, 100 );
      obj.depth     = props.get( 103, 100 );
      obj.segmentsW = props.get( 301, 1 );
      obj.segmentsH = props.get( 302, 1 );
      obj.segmentsD = props.get( 303, 1 );
      obj.tile6     = props.get( 701, true );
    },

    setupSphere : function( obj, props ){
      obj.radius    = props.get( 101, 100 );
      obj.segmentsW = props.get( 301, 16 );
      obj.segmentsH = props.get( 302, 12 );
      obj.yUp       = props.get( 701, true );
    },

    setupCylinder : function( obj, props ){
      obj.topRadius     = props.get( 101, 50 );
      obj.bottomRadius  = props.get( 102, 50 );
      obj.height        = props.get( 103, 100 );
      obj.segmentsW     = props.get( 301, 16 );
      obj.segmentsH     = props.get( 302, 1 );
      obj.topClosed     = props.get( 701, true );
      obj.bottomClosed  = props.get( 702, true );
      // obj.surfaceClosed = props.get( , true );
      obj.yUp           = props.get( 703, true );
    },

    setupCone : function( obj, props ){
      obj.radius    = props.get( 101, 50 );
      obj.height    = props.get( 102, 100 );
      obj.segmentsW = props.get( 301, 16 );
      obj.segmentsH = props.get( 302, 1 );
      obj.closed    = props.get( 701, true );
      obj.yUp       = props.get( 702, true );
    },

    setupCapsule : function( obj, props ){
      obj.radius    = props.get( 101, 50 );
      obj.height    = props.get( 102, 100 );
      obj.segmentsW = props.get( 301, 16 );
      obj.segmentsH = props.get( 302, 15 );
      obj.yUp       = props.get( 701, true );
    },

    setupTorus : function( obj, props ){
      obj.radius     = props.get( 101, 50 );
      obj.tubeRadius = props.get( 102, 50 );
      obj.segmentsR  = props.get( 301, 16 );
      obj.segmentsT  = props.get( 302, 8 );
      obj.yUp        = props.get( 701, true );
    },

    setupPropsPlane : function( obj, props ){
      props.set( 101, obj.width       );
      props.set( 102, obj.height      );
      props.set( 301, obj.segmentsW   );
      props.set( 302, obj.segmentsH   );
      props.set( 701, obj.yUp         );
      props.set( 702, obj.doubleSided );
    },

    setupPropsCube : function( obj, props ){
      props.set( 101, obj.width     );
      props.set( 102, obj.height    );
      props.set( 103, obj.depth     );
      props.set( 301, obj.segmentsW );
      props.set( 302, obj.segmentsH );
      props.set( 303, obj.segmentsD );
      props.set( 701, obj.tile6     );
    },

    setupPropsSphere : function( obj, props ){
      props.set( 101, obj.radius    );
      props.set( 301, obj.segmentsW );
      props.set( 302, obj.segmentsH );
      props.set( 701, obj.yUp       );
    },

    setupPropsCylinder : function( obj, props ){
      props.set( 101, obj.topRadius    );
      props.set( 102, obj.bottomRadius );
      props.set( 103, obj.height       );
      props.set( 301, obj.segmentsW    );
      props.set( 302, obj.segmentsH    );
      props.set( 701, obj.topClosed    );
      props.set( 702, obj.bottomClosed );
      props.set( 703, obj.yUp          );
        // obj.surfaceClosed = props.set( , true );
    },

    setupPropsCone : function( obj, props ){
      props.set( 101, obj.radius    );
      props.set( 102, obj.height    );
      props.set( 301, obj.segmentsW );
      props.set( 302, obj.segmentsH );
      props.set( 701, obj.closed    );
      props.set( 702, obj.yUp       );
    },

    setupPropsCapsule : function( obj, props ){
      props.set( 101, obj.radius    );
      props.set( 102, obj.height    );
      props.set( 301, obj.segmentsW );
      props.set( 302, obj.segmentsH );
      props.set( 701, obj.yUp       );
    },

    setupPropsTorus : function( obj, props ){
      props.set( 101, obj.radius     );
      props.set( 102, obj.tubeRadius );
      props.set( 301, obj.segmentsR  );
      props.set( 302, obj.segmentsT  );
      props.set( 701, obj.yUp        );
    }

  });


  module.exports = Primitive;



}());