exports.config = {
  directConnect: true,
  capabilities: {
    'browserName': 'firefox'
  },
  framework: 'jasmine',
  specs: ['../tests/**/*.spec.js'],
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },
  onPrepare: function() {
    browser.ignoreSynchronization = true;
  }
};