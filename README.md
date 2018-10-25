# npmlist &nbsp;&nbsp; [![npm](https://img.shields.io/npm/v/@hankchanocd/npmlist.svg)](https://www.npmjs.com/package/@hankchanocd/npmlist) [![Build Status](https://travis-ci.org/hankchanocd/npmlist.svg?branch=master)](https://travis-ci.org/hankchanocd/npmlist) [![Known Vulnerabilities](https://snyk.io/test/github/hankchanocd/npmlist/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hankchanocd/npmlist?targetFile=package.json) ![Github issues](https://img.shields.io/github/issues/hankchanocd/npmlist.svg)

> Fuzzy list anything listable from any npm package, i.e. dependencies, scripts, profile.

<br />
<br />
<p align="center">
<img alt="demo animation" width="700" src="https://hankchanocd.github.io/npmlist/examples/demo.svg" />
</p>
<br />

`npmlist` or `npl` (`npl` for the sake of typing) fuzzifies all the lists it can find about a npm module, ready to execute and search it. Its default feature is local dependencies listing, but can be changed with feature flags. It has clear advantages over painfully slow and cluttered `npm list`:

1. Selecting a package on fuzzy list will automatically trigger `npm info <package>`
2. `npl -t` gives a quick refresher on the recent global installs
3. `npl -g` finds and prints global modules as fancy as `brew list`, and more than 10x faster than `npm list -g`
4. `npl -s` lists and triggers npm scripts better than `npm run-script`
5. A replacement for `npm list --depth=0 --local` and other annoyingly long `npm list --@#$%` commands with assumed configurations
6. No need to leave terminal just for glancing at a package's npm profile

## Install

```bash
$ npm install -g @hankchanocd/npmlist
```

## Usage

```
Usage: npl [option] [name]

Fuzzy list anything listable with npm package

Options:

  -v, --version      output the version number
  -l, --local        list local dependencies, which is also the default feature
  -g, --global       list global modules
  -d, --details      include details to each dependency, but disable the default fuzzy mode
  -t, --time         show the latest 20 modules installed globally
  -s, --scripts      list/execute npm scripts
  -a, --all          a flavor flag that shows all available information on any feature flags
  -F, --no-fuzzy     disable the fuzzy mode and resort to stdout
  -i, --interactive  enable interactive mode (in development)
  -h, --help         output usage information
```

## Examples

### Global modules

More than 10x faster than `npm list -g`

```bash
$ npl -g

? Select an item:
/usr/local/bin/lib
├── @angular/cli@6.2.4
├── aerobatic-cli@1.1.4
```

### Recent added global modules

A quick refresher on what the heck it's installed/upgraded globally in the recent past

```bash
$ npl -t

? Select an item:
NAME                  TIME
@hankchanocd/npmlist  10-5 21:29
semantic-release      10-5 8:5
```

### Execute module's npm scripts

Somewhat similar to [```ntl```](https://github.com/ruyadorno/ntl)

```bash
$ npmlist -s

? Select an item:
express@4.16.4
build: babel src/ -d build/ --quiet
test: mocha
```

### Fetch from NPM registry

`npl` fetches the module's latest version by default, unless a version is specified

```bash
$ npl express

? Select an item:
express@4.16.4 Dependencies:
├── accepts@1.3.5
├── array-flatten@1.1.1
```

### Turn off fuzzy mode

Fuzzy mode is turned on in most cases, except for `--details`, where fuzzy is not optimal for multi-line text. You can also opt for `--no-fuzzy` to turn off the default fuzzy mode.

```bash
$ npl -t --no-fuzzy
$ npl -g --no-fuzzy
$ npl -s --no-fuzzy
```

<p align="center"><img src="https://github.com/hankchanocd/npmlist/blob/master/images/no-fuzzy-demo.png" width="650"></p>

### Details flag

Applied to both local dependencies and global installs

```
$ npl --details
$ npl -g --details
```

<p align="center"><img src="https://github.com/hankchanocd/npmlist/blob/master/images/details-flag-demo.png" width="650"></p>

## API

Build a Web or CLI tool on top of ```npl```'s [API](https://github.com/hankchanocd/npmlist/wiki/API).

## Tests

To perform unit tests and integration tests, simply run `npm test`.

## Changelog

**2018-Oct-16:** Fuzzy mode is now enabled by default. It can be turned off by `--no-fuzzy`.

**2018-Oct-18:** Give up on trying to pipe output to `less`. Nodejs simply does not control TTY.

**2018-Oct-19:** Speed up `npmlist -g` 10x than `npm list -g`

**2018-Oct-20:** `npmlist` can also be accessed via `npl`

**2018-Oct-21:** The first official [API](https://github.com/hankchanocd/npmlist/wiki/API) guide released.

## Contribution

`npl` started off as a bunch of CLI aliases on top of `npm list` and `npm info`, but grew larger quickly. It's now very effective at checking a package's dependencies. Saying all these means we are not afraid of expanding `npl` features beyond the current realm.

The roadmap for `npl` now focuses on presenting a quick and concise report on terminal with minimal commands (it means no sub-commands), freeing developers from the burden of constant switching between terminal and browser. See [Wiki](https://github.com/hankchanocd/npmlist/wiki/DOCS) for `npl`'s code architecture, developments rules, and styles. See [here](./CONTRIBUTION.md) on how to contribute.

If you like the idea of fuzzy list, check out ruyadorno's [`ipt`](https://github.com/ruyadorno/ipt#readme).

## License

[ISC](./LICENSE.md)
