// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

//require all modules ending in ".spec.ts"
// const glob = require('glob');
// const specFiles = glob("./src/**/*.spec.ts");
const specFiles = "./**/*.spec.ts";

let isWin = /^win/.test(process.platform);
let webpack = require('./webpack.test');

module.exports = function (config) {
  config.set({
	webpack,
    basePath: 'src',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-spec-reporter'),
      require('karma-webpack'),
      require('karma-sourcemap-loader')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: specFiles, watched: true }
    ],
    preprocessors: {
    	'**/*.ts': ['webpack', 'sourcemap']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    reporters: ['spec', 'kjhtml', 'coverage-istanbul'],
    port: 9876,
    colors: true,
    // logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [],
    singleRun: false
  });
  
  config.browsers.push('Firefox');
};
