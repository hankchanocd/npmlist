# npmlist

[![npm](https://img.shields.io/npm/v/@hankchanocd/npmlist.svg)](https://www.npmjs.com/package/@hankchanocd/npmlist) [![David](https://img.shields.io/david/hankchanocd/npmlist.svg)](https://david-dm.org) [![David](https://img.shields.io/david/dev/hankchanocd/npmlist.svg)]((https://david-dm.org))

[![Build Status](https://travis-ci.org/hankchanocd/npmlist.svg?branch=master)](https://travis-ci.org/hankchanocd/npmlist) [![Github issues](https://img.shields.io/github/issues/hankchanocd/npmlist.svg)](https://github.com/hankchanocd/npmlist/issues) [![Known Vulnerabilities](https://snyk.io/test/github/hankchanocd/npmlist/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hankchanocd/npmlist?targetFile=package.json) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> Search npm modules' dependencies.

&nbsp;

`npmlist` is a library providing searching and parsing dependencies, global installs, scripts, profile. It empowers many CLI apps, i.e. [`npm-fzf`](#use-cases).

## Requirements

`npmlist` requires Node 8 or above for runtime.

## API

### Install

```bash
$ npm install @hankchanocd/npmlist
```

### Examples

#### Search npm modules

```js
const { npmSearch } = require("@hankchanocd/npmlist");

let module = ['express'];
npmSearch(module)
	.then(i => i.raw())
	.then(i => yourFunction)
	.catch(err => console.log(err));

// 92 express@4.16.4 express framework sinatra web rest restful router app api
// 91 path-to-regexp@2.4.0 express regexp route routing
```

#### List local dependencies

```js
const { npmDependencies } = require("@hankchanocd/npmlist");
const { npmList } = npmDependencies;

npmList()
	.raw()
	.then(i => yourFunction)
	.catch(err => console.log(err));

// @express@1.0.0
// ├── Dependencies
// ├── chalk@2.4.1
```

#### List npm module's scripts

```js
const { npmScripts } = require("@hankchanocd/npmlist");

npmScripts()
	.raw()
	.then(i => yourFunction)
	.catch(err => console.log(err));

// @express@1.0.0
// build => babel src/ -d build/ --quiet
// commit => git-cz
```

`npmlist` has a few distinct advantages:

1. `npmSearch()` searches for npm modules with [npms.io](https://npms.io), a better npm search engine than `npm search` with score analysis.
2. `npmList()` is a replacement for painfully long and slow `npm list --depth=0 --local` and other `npm list --@#$%` commands
3. `npmScripts()` lists npm scripts better than `npm run-script`
4. `npmRecent()` gives a quick refresher on the recent global installs
5. `npmGlobal()` finds and prints global modules as fancy as `brew list`, and more than 10x faster than `npm list -g`

Read [API doc](https://github.com/hankchanocd/npmlist/wiki/API) to find out more.

## Tests

To perform unit tests and integration tests, simply run `npm test`.

## Changelog

[CHANGELOG](./CHANGELOG.md)

## Contribution

`npmlist` started off as a bunch of CLI aliases on top of `npm list` and `npm info`, but grew larger quickly. It's now very effective at checking a package's dependencies and global installs. This is to say we are not afraid of expanding `npmlist` features beyond the current realm.

The roadmap for `npmlist` now focuses on serving as a library to provide a quick and concise report on terminal, freeing developers from the burden of constant switching between terminal and browser. See [Wiki](https://github.com/hankchanocd/npmlist/wiki/Wiki) for `npmlist`'s code architecture, developments rules, and styles. See [here](./CONTRIBUTING.md) on how to contribute.

## Use Cases

[`npm-fzf`](https://github.com/hankchanocd/npm-fzf) - Fuzzy search npm modules with [`fzf`](https://github.com/junegunn/fzf)

## License

[ISC](./LICENSE.md)
