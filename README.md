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

<br />

## CLI

`npmlist` also provides its own CLI implementation called `npl`, which fuzzifies all the lists it can find about a npm module using [`ipt`](https://github.com/ruyadorno/ipt#readme), making it easier for search and execution. `npl`'s default feature is local dependencies listing.

<br />
<br />
<p align="center">
<img alt="demo animation" width="700" src="https://hankchanocd.github.io/npmlist/examples/demo.svg" />
</p>
<br />

### Install

```bash
$ npm install -g @hankchanocd/npmlist
```

### Usage

```
Usage: npl [option] [name]

Fuzzy search npm modules' dependencies

Options:

-v, --version   output the version number

# Feature flags
-l, --local     list local dependencies, which is also the default feature
-g, --global    list global modules
-t, --time      show the latest global installs
-s, --scripts   list/execute npm scripts

# Flavor flags
-d, --details   include details to each dependency, but disable the default fuzzy mode
-a, --all       a flavor flag that shows all available information on any feature flag
-F, --no-fuzzy  disable the default fuzzy mode and resort to stdout

-h, --help      output usage information
```

### Examples

#### Global modules

```bash
$ npl -g

? (Use arrow keys or type to search)
  ├── @angular/cli@6.2.4
  ├── aerobatic-cli@1.1.4
```

#### Recent global installs

```bash
$ npl -t

? (Use arrow keys or type to search)
@hankchanocd/npmlist  10-5 21:29
semantic-release      10-5 8:5
```

#### Execute module's npm scripts

Somewhat similar to [`ntl`](https://github.com/ruyadorno/ntl)

```bash
$ npl -s

express@4.16.4
? run (Use arrow keys or type to search)
build: babel src/ -d build/ --quiet
test: mocha
```

#### Fetch from NPM registry

`npl` fetches the module's latest version by default, unless a version is specified

```bash
$ npl express

express@4.16.4 Dependencies:
? (Use arrow keys or type to search)
├── accepts@1.3.5
├── array-flatten@1.1.1
```

#### Turn off fuzzy mode

Fuzzy mode is turned on in most cases, except for `--details`, where fuzzy is not optimal for multi-line text. You can also opt for `--no-fuzzy` to turn off the default fuzzy mode.

```bash
$ npl -t --no-fuzzy
$ npl -g --no-fuzzy
$ npl -s --no-fuzzy
```

  <p align="center"><img src="https://raw.githubusercontent.com/hankchanocd/npmlist/master/images/no-fuzzy-demo.png" width="650"></p>

#### Details flag

Applied to both local dependencies and global installs

```
$ npl --details
$ npl -g --details
```

  <p align="center"><img src="https://raw.githubusercontent.com/hankchanocd/npmlist/master/images/details-flag-demo.png" width="650"></p>

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
