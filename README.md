# ember-cli-tslint

[![Greenkeeper badge](https://badges.greenkeeper.io/t-sauer/ember-cli-tslint.svg)](https://greenkeeper.io/)

[TSLint](https://palantir.github.io/tslint/) for [Ember CLI](https://ember-cli.com/) apps and addons

## Installation

```
ember install ember-cli-tslint
```

`ember-cli-tslint` will remove ESLint from your current project and replace the config files with a new `tslint.json` file.

## Usage

TSLint will be run by `ember-cli-qunit` automatically when you run `ember test`. `ember-cli-mocha` is not yet supported.

## Contributing

### Installation

* `git clone <repository-url>` this repository
* `cd ember-cli-tslint`
* `yarn install`

### Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `yarn test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## License

This project is licensed under the [MIT License](LICENSE.md).
