const Spec = require('mocha/lib/reporters/spec');
const Base = require('mocha/lib/reporters/base');

module.exports = class CustomReporter extends Spec {
  constructor(runner, options) {
    super(runner, options);
    
    let passes = 0;
    let failures = 0;

    runner.on('pass', () => {
      passes++;
    });

    runner.on('fail', () => {
      failures++;
    });

    runner.once('end', () => {
      console.log('\n' + '='.repeat(50));
      console.log(`TEST SUMMARY: ${passes} passed, ${failures} failed (Total: ${passes + failures})`);
      console.log('='.repeat(50));
    });
  }
};
