var fs = require('fs-extra');
var exec = require('child_process').exec;

var expect = require('chai').expect;

var FAILING_FILE = __dirname + '/../tests/dummy/app/unused.js';

describe('ember-cli-tslint', function() {
  this.timeout(60000);

  afterEach(function() {
    fs.removeSync(FAILING_FILE);
  });

  it.skip('passes if TSLint tests pass', function() {
    process.env['NO_GROUPING'] = true;

    return emberTest().then(function(result) {
      expect(result.error).to.not.exist;
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 1 PhantomJS 2.1 - TSLint | app.js: should pass TSLint')
        .to.contain('ok 2 PhantomJS 2.1 - TSLint | controllers/thing.js: should pass TSLint')
        .to.contain('ok 3 PhantomJS 2.1 - TSLint | helpers/destroy-app.js: should pass TSLint')
        .to.contain('ok 4 PhantomJS 2.1 - TSLint | helpers/module-for-acceptance.js: should pass TSLint')
        .to.contain('ok 5 PhantomJS 2.1 - TSLint | helpers/resolver.js: should pass TSLint')
        .to.contain('ok 6 PhantomJS 2.1 - TSLint | helpers/start-app.js: should pass TSLint')
        .to.contain('ok 7 PhantomJS 2.1 - TSLint | models/thing.js: should pass TSLint')
        .to.contain('ok 8 PhantomJS 2.1 - TSLint | resolver.js: should pass TSLint')
        .to.contain('ok 9 PhantomJS 2.1 - TSLint | router.js: should pass TSLint')
        .to.contain('ok 10 PhantomJS 2.1 - TSLint | test-helper.js: should pass TSLint')
        .to.not.contain('not ok 11 PhantomJS 2.1 - TSLint | unused.js: should pass TSLint');
    })
  });

  it.skip('fails if a TSLint tests fails', function() {
    process.env['NO_GROUPING'] = true;

    fs.outputFileSync(FAILING_FILE, 'let unused = 6;\n');

    return emberTest({ NO_GROUPING: true }).then(function(result) {
      expect(result.error).to.exist;
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 1 PhantomJS 2.1 - TSLint | app.js: should pass TSLint')
        .to.contain('ok 2 PhantomJS 2.1 - TSLint | controllers/thing.js: should pass TSLint')
        .to.contain('ok 3 PhantomJS 2.1 - TSLint | helpers/destroy-app.js: should pass TSLint')
        .to.contain('ok 4 PhantomJS 2.1 - TSLint | helpers/module-for-acceptance.js: should pass TSLint')
        .to.contain('ok 5 PhantomJS 2.1 - TSLint | helpers/resolver.js: should pass TSLint')
        .to.contain('ok 6 PhantomJS 2.1 - TSLint | helpers/start-app.js: should pass TSLint')
        .to.contain('ok 7 PhantomJS 2.1 - TSLint | models/thing.js: should pass TSLint')
        .to.contain('ok 8 PhantomJS 2.1 - TSLint | resolver.js: should pass TSLint')
        .to.contain('ok 9 PhantomJS 2.1 - TSLint | router.js: should pass TSLint')
        .to.contain('ok 10 PhantomJS 2.1 - TSLint | test-helper.js: should pass TSLint')
        .to.contain('not ok 11 PhantomJS 2.1 - TSLint | unused.js: should pass TSLint');
    })
  });

  it.skip('passes if TSLint tests pass (grouped)', function() {
    delete process.env['NO_GROUPING'];

    return emberTest().then(function(result) {
      expect(result.error).to.not.exist;
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 1 PhantomJS 2.1 - TSLint | app: app.js')
        .to.contain('ok 2 PhantomJS 2.1 - TSLint | app: controllers/thing.js')
        .to.contain('ok 3 PhantomJS 2.1 - TSLint | app: models/thing.js')
        .to.contain('ok 4 PhantomJS 2.1 - TSLint | app: resolver.js')
        .to.contain('ok 5 PhantomJS 2.1 - TSLint | app: router.js')
        .to.not.contain('not ok 6 PhantomJS 2.1 - TSLint | app: unused.js');

      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 6 PhantomJS 2.1 - TSLint | tests: helpers/destroy-app.js')
        .to.contain('ok 7 PhantomJS 2.1 - TSLint | tests: helpers/module-for-acceptance.js')
        .to.contain('ok 8 PhantomJS 2.1 - TSLint | tests: helpers/resolver.js')
        .to.contain('ok 9 PhantomJS 2.1 - TSLint | tests: helpers/start-app.js')
        .to.contain('ok 10 PhantomJS 2.1 - TSLint | tests: test-helper.js');
    })
  });

  it.skip('fails if a TSLint tests fails (grouped)', function() {
    delete process.env['NO_GROUPING'];

    fs.outputFileSync(FAILING_FILE, 'let unused = 6;\n');

    return emberTest().then(function(result) {
      expect(result.error).to.exist;
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 1 PhantomJS 2.1 - TSLint | app: app.js')
        .to.contain('ok 2 PhantomJS 2.1 - TSLint | app: controllers/thing.js')
        .to.contain('ok 3 PhantomJS 2.1 - TSLint | app: models/thing.js')
        .to.contain('ok 4 PhantomJS 2.1 - TSLint | app: resolver.js')
        .to.contain('ok 5 PhantomJS 2.1 - TSLint | app: router.js')
        .to.contain('not ok 6 PhantomJS 2.1 - TSLint | app: unused.js');

      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 7 PhantomJS 2.1 - TSLint | tests: helpers/destroy-app.js')
        .to.contain('ok 8 PhantomJS 2.1 - TSLint | tests: helpers/module-for-acceptance.js')
        .to.contain('ok 9 PhantomJS 2.1 - TSLint | tests: helpers/resolver.js')
        .to.contain('ok 10 PhantomJS 2.1 - TSLint | tests: helpers/start-app.js')
        .to.contain('ok 11 PhantomJS 2.1 - TSLint | tests: test-helper.js');
    })
  });

  it.skip('passes if jsx files are included', function() {
    process.env['JSX'] = true;

    return emberTest().then(function(result) {
      expect(result.error).to.not.exist;
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 1 PhantomJS 2.1 - TSLint | app: app.js')
        .to.contain('ok 2 PhantomJS 2.1 - TSLint | app: controllers/thing.js')
        .to.contain('ok 3 PhantomJS 2.1 - TSLint | app: models/thing.js')
        .to.contain('ok 4 PhantomJS 2.1 - TSLint | app: resolver.js')
        .to.contain('ok 5 PhantomJS 2.1 - TSLint | app: router.js')
        .to.contain('ok 6 PhantomJS 2.1 - TSLint | app: routes/thing.jsx')
        .to.not.contain('not ok 7 PhantomJS 2.1 - TSLint | app: unused.js');

      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 7 PhantomJS 2.1 - TSLint | tests: helpers/destroy-app.js')
        .to.contain('ok 8 PhantomJS 2.1 - TSLint | tests: helpers/module-for-acceptance.js')
        .to.contain('ok 9 PhantomJS 2.1 - TSLint | tests: helpers/resolver.js')
        .to.contain('ok 10 PhantomJS 2.1 - TSLint | tests: helpers/start-app.js')
        .to.contain('ok 11 PhantomJS 2.1 - TSLint | tests: test-helper.js');
    })
  });
});

function emberTest() {
  return new Promise(function(resolve) {
    exec('node_modules/.bin/ember test', { cwd: __dirname + '/..', env: process.env }, function (error, stdout, stderr) {
      resolve({
        error: error,
        stdout: stdout,
        stderr: stderr
      });
    });
  });
}
