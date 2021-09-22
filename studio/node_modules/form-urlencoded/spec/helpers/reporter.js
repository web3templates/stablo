// Filename: reporter.js  
// Timestamp: 2017.02.02-10:18:00 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

jasmine.getEnv().clearReporters();               // remove default reporter logs
jasmine.getEnv().addReporter(new SpecReporter({  // add jasmine-spec-reporter
  spec: {
    displayPending: true
  },
  summary: {
    displayDuration: false
  }
}));
