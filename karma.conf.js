module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'jasmine-matchers'],
    plugins: [
      'karma-jasmine',
      'karma-jasmine-matchers'
    ],
    files: [
      'src/**/*.spec.ts'
    ],
    preprocessors: {
      'src/**/*.spec.ts': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        extensions: ['.ts', '.js']
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  });
};