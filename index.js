/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cli-tslint',

  lintTree(type, tree) {
    if (type === 'templates') {
      return undefined;
    }

    const TSLint = require('broccoli-tslinter');


    return new TSLint(tree, {
    });
  }
};
