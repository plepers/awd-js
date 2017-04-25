module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['browserify', 'mocha'],


    // list of files / patterns to load in the browser
    files: [
      'test/defines.js',
      'test/*.js',
      'test/extensions/**/*.js',
      {pattern: 'test/samples/*.awd.gz', included: false, served: true }
    ],

    proxies: {
      "/test/samples/": "/base/test/samples/"
    },


    // list of files to exclude
    exclude: [
    ],


    preprocessors: {
      'test/*.js':               [ 'browserify' ],
      'test/extensions/**/*.js': [ 'browserify' ]
    },

    browserify: {
      debug: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    sauceLabs: {
      startConnect: true,
      testName: 'eagl unit tests'
    },

    // define SL browsers
    customLaunchers: {

      // OSX Maverick

      'SL_Chrome_OSX9': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: '40.0',
        platform: 'OS X 10.10'
      }
      // ,
      // 'SL_Firefox_OSX9': {
      //   base: 'SauceLabs',
      //   browserName: 'firefox',
      //   version: '38',
      //   platform: 'OS X 10.10'
      // },
      // 'SL_Safari': {
      //   base: 'SauceLabs',
      //   browserName: 'safari',
      //   platform: 'OS X 10.10',
      //   version: '8'
      // },

      // //Win 8.1
      // 'SL_Chrome_WIN81': {
      //   base: 'SauceLabs',
      //   browserName: 'chrome',
      //   version: '40',
      //   platform: 'Windows 8.1'
      // }


      // ,
      // 'SL_IE_11': {
      //   base: 'SauceLabs',
      //   browserName: 'internet explorer',
      //   platform: 'Windows 8.1',
      //   version: '11'
      // },
    },



    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [ 'Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,


  });

  if( process.env.TRAVIS ) {

    var browsers = [];
    for( var browser in config.customLaunchers ){
      browsers.push( browser );
    }
    config.browsers = browsers;

    config.autoWatch = false;
    config.singleRun = true;

  }
};
