var derequirePlugin = require( 'derequire/plugin' )

var dereqFunc = function(b){
  derequirePlugin( b, '_dereq_', 'require');
}

module.exports = function( id, externals, expose ){

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

  res.options.alias[id] = '.tmp/'+id+'.js'

  if( expose === true ){
    id += '_require'
  } else {
    res.options.browserifyOptions.standalone = id;
  }

  res.files['tmp/'+id+'.js'] = []

  return res;
}