/* eslint-env node */
'use strict';

const TSLint = require('broccoli-tslinter');
const Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-cli-tslint',

  lintTree(type, tree) {
    if (type === 'templates') {
      return undefined;
    }

    return new TSLint(
      new Funnel(tree, { include: ['**/*.ts'] }),
      {}
    );
  }
};
