'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var fs = require('fs-extra');
var path = require('path');
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;
var modifyPackages = blueprintHelpers.modifyPackages;

var chai = require('ember-cli-blueprint-test-helpers/chai');
var expect = chai.expect;
var file = chai.file;

var td = require('testdouble');
td.config({ promiseConstructor: require('rsvp').Promise });

var requireFromCLI = require('ember-cli-blueprint-test-helpers/lib/helpers/require-from-cli');

describe('Acceptance: install ember-cli-tslint', function() {
  setupTestHooks(this);

  var Blueprint = requireFromCLI('lib/models/blueprint');
  var MockUI = require('console-ui/mock');

  var taskFor, installTaskRun, uninstallTaskRun, prompt;
  beforeEach(function() {
    installTaskRun = td.function();
    td.when(installTaskRun(td.matchers.anything())).thenResolve();

    uninstallTaskRun = td.function();
    td.when(uninstallTaskRun(td.matchers.anything())).thenResolve();

    taskFor = td.function();
    td.when(taskFor('npm-install')).thenReturn({ run: installTaskRun });
    td.when(taskFor('npm-uninstall')).thenReturn({ run: uninstallTaskRun });

    td.replace(Blueprint.prototype, 'taskFor', taskFor);

    prompt = td.function();
    td.replace(MockUI.prototype, 'prompt', prompt);
  });

  afterEach(function() {
    td.reset();
  });

  it('removes the ESLint addon', function() {
    var args = ['ember-cli-tslint', 'foo'];

    td.when(prompt(td.matchers.anything())).thenResolve({ deleteFiles: 'all' });

    return emberNew()
      .then(function() {
        fs.ensureFileSync('.eslintrc.js');
        fs.ensureFileSync('tests/.eslintrc.js');

        modifyPackages([
          { name: 'ember-cli-eslint', dev: true }
        ]);

        expect(file('package.json')).to.contain('ember-cli-eslint');
        expect(file('.eslintrc.js')).to.exist;
        expect(file('tests/.eslintrc.js')).to.exist;
      })
      .then(function() {
        return emberGenerate(args);
      })
      .then(function() {
        // verify that `npm uninstall --save-dev ember-cli-eslint` was called
        var captor = td.matchers.captor();
        td.verify(uninstallTaskRun(captor.capture()));
        var taskOptions = captor.value;
        expect(taskOptions.packages).to.contain('ember-cli-eslint');

        // verify that the ESLint config file were deleted
        expect(file('.eslintrc.js')).to.not.exist;
        expect(file('tests/.eslintrc.js')).to.not.exist;
      });
  });

  it('keeps the ESLint addon if it should', function() {
    var args = ['ember-cli-tslint', 'foo'];

    td.when(prompt(td.matchers.anything())).thenResolve({ deleteDependency: 'keep' });

    return emberNew()
      .then(function() {
        fs.ensureFileSync('.eslintrc.js');
        fs.ensureFileSync('tests/.eslintrc.js');

        modifyPackages([
          { name: 'ember-cli-eslint', dev: true }
        ]);

        expect(file('package.json')).to.contain('ember-cli-eslint');
        expect(file('.eslintrc.js')).to.exist;
        expect(file('tests/.eslintrc.js')).to.exist;
      })
      .then(function() {
        return emberGenerate(args);
      })
      .then(function() {
        // verify that the ESLint dependency was not removed
        expect(file('package.json')).to.contain('ember-cli-eslint');

        // verify that the ESLint config file were not deleted
        expect(file('.eslintrc.js')).to.exist;
        expect(file('tests/.eslintrc.js')).to.exist;
      });
  });

  it('Does not touch foreign .eslintrc.js files', function() {
    var args = ['ember-cli-tslint', 'foo'];
    var foreignESLintrcPaths = [
      path.join('.', 'bower_components', 'foreign-package', '.eslintrc.js'),
      path.join('.', 'tmp', '.eslintrc.js'),
      path.join('.', 'tests', 'dummy', 'app', 'node_modules', 'foreign-package', '.eslintrc.js'),
      path.join('.', 'tests', 'dummy', 'app', 'dist', '.eslintrc.js')
    ];

    td.when(prompt(td.matchers.anything())).thenResolve({ deleteFiles: 'all' });

    return emberNew()
      .then(function() {
        foreignESLintrcPaths.forEach(function(foreignESLintrcPath) {
          fs.ensureFileSync(foreignESLintrcPath);
        });
      })
      .then(function() {
        return emberGenerate(args);
      })
      .then(function() {
        foreignESLintrcPaths.forEach(function(foreignESLintrcPath) {
          expect(file(foreignESLintrcPath)).to.exist;
        });
      });
  });

  it('does not remove any files if it shouldn\'t', function() {
    var args = ['ember-cli-tslint', 'foo'];

    td.when(prompt(td.matchers.anything())).thenResolve({ deleteFiles: 'none' });

    return emberNew()
      .then(function() {
        fs.ensureFileSync('.eslintrc.js');
        fs.ensureFileSync('tests/.eslintrc.js');

        expect(file('.eslintrc.js')).to.exist;
        expect(file('tests/.eslintrc.js')).to.exist;
      })
      .then(function() {
        return emberGenerate(args);
      })
      .then(function() {
        // verify that the ESLint config file were *not* deleted
        expect(file('.eslintrc.js')).to.exist;
        expect(file('tests/.eslintrc.js')).to.exist;
      });
  });
});
