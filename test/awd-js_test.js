'use strict';


var Awd     = require('../lib/awd'),
    expect  = require('expect.js');


describe( "sample test", function(){

  it( "awd has header", function(){

    var awd = new Awd();
    expect( awd.header ).to.be.ok();

  });
});
