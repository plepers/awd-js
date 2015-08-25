var derequirePlugin = require( 'derequire/plugin' )

var dereqFunc = function(b){
  derequirePlugin( b, '_dereq_', 'require');
}


function makeConfig( id, externals, expose ){

  var res = {
    options: {
      external : externals,
      alias: { },
      browserifyOptions: {
        node : true,
        paths:[ './extensions', './src' ],
        //bundleExternal : false
        plugin: [
          dereqFunc,
        ]
      }
    },
    files: {}
  }


  if( expose === true ){
    id += '_require'
  } else {
    res.options.browserifyOptions.standalone = id;
  }

  res.files['tmp/'+id+'.js'] = []

  return res;
}

module.exports = {
  main : function( id, externals, expose ){
    var res = makeConfig( id, externals, expose );
    res.options.alias[id] = '.tmp/'+id+'.js';
    return res;
  },

  ext : function( id, externals, expose ){
    var res = makeConfig( 'awdlib_'+id, externals, expose );
    res.options.alias['awdlib_'+id] = './extensions/'+id+'/index.js';
    return res;
  }
}