'use strict';

var Awd         = require('../src/awd'),
    Container   = require('../src/std/Container' ),
    Consts      = require('../src/consts' ),
    expect      = require('expect.js');



describe( "create brand new awd", function(){

  it( "empty is ok to write", function(){

    var buf;

    var write = function(){
      var awd = new Awd();
      buf = awd.write();
    }

    expect(write).to.not.throwException();

    var parse = function(){
      var awd = new Awd();
      awd.parse( buf );
    }

    expect(parse).to.not.throwException();

  });

  it( "container is ok", function(){


    var awd = new Awd();

    var container = new Container();
    container.name = "abc123";
    awd.addElement( container );

    var buf = awd.write();


    awd = new Awd();
    awd.parse( buf );

    var conts = awd.getDatasByType( Consts.CONTAINER );


    expect( conts.length ).to.be.equal( 1 );
    expect( conts[0].name ).to.be.equal( "abc123" );

  });

});
