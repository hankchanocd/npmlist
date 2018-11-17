# npmlist

[![npm](https://img.shields.io/npm/v/@hankchanocd/npmlist.svg)](https://www.npmjs.com/package/@hankchanocd/npmlist) [![Build Status](https://travis-ci.org/hankchanocd/npmlist.svg?branch=master)](https://travis-ci.org/hankchanocd/npmlist) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Known Vulnerabilities](https://snyk.io/test/github/hankchanocd/npmlist/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hankchanocd/npmlist?targetFile=package.json) [![Github issues](https://img.shields.io/github/issues/hankchanocd/npmlist.svg)](https://github.com/hankchanocd/npmlist/issues)

> Fuzzy search npm modules' dependencies.

`npmlist` is a library providing parsing and fetching dependencies, global installs, scripts, profile. It empowers many CLI apps, i.e. [`npm-fzf`](#use-cases).

## Requirements

`npmlist` requires Node 8 or above for runtime.

## API

### Install

```bash
$ npm install @hankchanocd/npmlist
```

### Examples

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

`npmlist` has several advantages over painfully slow and cluttered `npm list`:

1. `npmList()` is a replacement for annoyingly long `npm list --depth=0 --local` and other `npm list --@#$%` commands
2. `npmScripts()` lists and triggers npm scripts better than `npm run-script`
3. `npmRecent()` gives a quick refresher on the recent global installs
4. `npmGlobal()` finds and prints global modules as fancy as `brew list`, and more than 10x faster than `npm list -g`

Read [API doc](https://github.com/hankchanocd/npmlist/wiki/API) to find out more.

## CLI

[CLI](./CLI.md) (deprecated)

## Tests

To perform unit tests and integration tests, simply run `npm test`.

## Changelog

[CHANGELOG](./CHANGELOG.md)

## Contribution

`npl` started off as a bunch of CLI aliases on top of `npm list` and `npm info`, but grew larger quickly. It's now very effective at checking a package's dependencies and global installs. This is to say we are not afraid of expanding `npl` features beyond the current realm.

The roadmap for `npl` now focuses on presenting a quick and concise report on terminal with minimal commands (it means no sub-commands), freeing developers from the burden of constant switching between terminal and browser. See [Wiki](https://github.com/hankchanocd/npmlist/wiki/Wiki) for `npl`'s code architecture, developments rules, and styles. See [here](./CONTRIBUTING.md) on how to contribute.

If you like the idea of fuzzy list, check out ruyadorno's [`ipt`](https://github.com/ruyadorno/ipt#readme).

## Use Cases

[`npm-fzf`](https://github.com/hankchanocd/npm-fzf) - Fuzzy search npm modules with [`fzf`](https://github.com/junegunn/fzf)

## License

[ISC](./LICENSE.md)
