/* global module */
// Karma configuration
// Generated on Wed Jun 14 2017 10:39:41 GMT+0200 (CEST)

module.exports = function(config) {

    /**
     * An additional parameter which we pass to the commandline call.
     * @type {String} 'classic'/'modern'
     */
    var TOOLKIT = config.toolkit || 'classic';
    var EXTJSPREFIX = TOOLKIT === 'modern' ? '-modern' : '';
    var proxyUrl = 'http://localhost:300' + TOOLKIT === 'classic' ? '0' : '1';
    var files = [
        'ext/build/ext' + EXTJSPREFIX + '-all-debug.js',
        'ext/packages/ux/classic/src/**/*js',
        'ext/packages/ux/modern/**/*js',
        'ext/packages/ux/src/**/*js',
        'test/' + TOOLKIT + '/loader.js',
        'resources/lib/openlayers-v3.19.1-dist/ol.js',
        'test/raf.polyfill.js',
        'overrides/**/*js',
        'test/test-helper-functions.js',
        'test/turn-off-ext-logger.js'
    ];

    if (TOOLKIT === 'classic') {
        files.push('test/spec/app/**/*.test.js');
    }
    files.push('test/spec/' + TOOLKIT + '/**/*.test.js');

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        proxies: {
            '/koalaProxy': proxyUrl,
            '/resources': '/base/resources'
        },

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'expect', 'sinon'],

        // list of files / patterns to load in the browser
        files: files,

        // list of files to exclude
        exclude: [
            // './resources/lib/**/test/*.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'app/**/*.js': ['coverage'],
            'classic/**/*.js': ['coverage'],
            'modern/**/*.js': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            // 'Chrome',
            // 'Firefox',
            'PhantomJS'
        ],

        phantomjsLauncher: {
            flags: [
                '--load-images=false',
                '--ssl-protocol=any',
                '--ignore-ssl-errors=true'
            ]
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // optionally, configure the reporter
        coverageReporter: {
            dir: 'coverage/' + TOOLKIT,
            type: 'json'
        }
    });
};
