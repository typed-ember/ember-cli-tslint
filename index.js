/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cli-tslint',

  _getTSLintOptions() {
  	const options = (this.parent && this.parent.options) || (this.app && this.app.options) || {};
  	return options['ember-cli-tslint'] || {};
  },

  lintTree(type, tree) {
    if (type === 'templates') {
      return undefined;
    }

    const TSLint = require('broccoli-tslinter');


    return new TSLint(tree, _getTSLintOptions());
  }
};
