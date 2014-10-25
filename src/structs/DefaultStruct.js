var Consts      = require( "../consts" ),
    BaseStruct  = require( './BaseStruct' );

var DefaultStruct = BaseStruct.createStruct( Consts.GENERIC, -1, {} );

module.exports = DefaultStruct;