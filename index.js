/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cli-tslint',

  lintTree(type, tree) {
    if (type === 'templates') {
      return undefined;
    }

    // NOTE: intentionally inlined to improve ember-cli startup performance.
    const TSLint = require('broccoli-tslinter');
    const Funnel = require('broccoli-funnel');

    return new TSLint(
      new Funnel(tree, { include: ['**/*.ts'] }),
      {}
    );
  }
};
