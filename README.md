# npmlist &nbsp;&nbsp; [![npm](https://img.shields.io/npm/v/@hankchanocd/npmlist.svg)](https://www.npmjs.com/package/@hankchanocd/npmlist) [![Build Status](https://travis-ci.org/hankchanocd/npmlist.svg?branch=master)](https://travis-ci.org/hankchanocd/npmlist) [![Known Vulnerabilities](https://snyk.io/test/github/hankchanocd/npmlist/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hankchanocd/npmlist?targetFile=package.json) ![Github issues](https://img.shields.io/github/issues/hankchanocd/npmlist.svg)

> A fuzzy CLI that lists everything listable from any npm package, i.e. dependencies, scripts, profile.

<br />
<br />
<p align="center">
<img alt="demo animation" width="700" src="https://hankchanocd.github.io/npmlist/examples/demo.svg" />
</p>
<br />

```npmlist``` fuzzifies all the lists it can find about a npm module, ready to execute and search it. Its default feature is dependencies listing. It has clear advantages over cluttered `npm list` and `npm info`:

1. Fuzzy selection of an package will automatically trigger `npm info <package>`
2. ```npmlist -s``` lists and triggers npm scripts better than `npm run-script`
3. ```npmlist -t``` is a good refresher on the recent global installs
4. A replacement for `npm list --depth=0 --local` and other annoyingly long `npm list --@#$%` commands with assumed configurations
5. No need to leave terminal just for glancing at a package's npm profile

## Install

```bash
$ npm install -g @hankchanocd/npmlist
```

## Usage

```
Usage: npmlist [option] [name]

Listing information of npm packages at command line

Options:

  -v, --version      output the version number
  -l, --local        list local dependencies, which is also the default mode
  -g, --global       list global modules
  -d, --details      include details to each dependency, but disable the default fuzzy mode
  -t, --time         show the latest 20 modules installed globally
  -s, --scripts      list/execute npm scripts
  -a, --all          a flavor flag that shows all available information on any feature flags
  -f, --fuzzy        enable fuzzy mode, which is now default on most features
  -n, --nofuzzy      disable the fuzzy mode and resort to stdout
  -i, --interactive  enable interactive mode (in development)
  -h, --help         output usage information
```

## Examples

### Global modules

```bash
$ npmlist -g

/usr/local/bin/lib
├── @angular/cli@6.2.4
├── aerobatic-cli@1.1.4
```

### Recent added global modules

A good refresher on what the heck you've installed/upgraded globally in the recent past

```bash
$ npmlist -t

NAME                 TIME
npmlist-cli          10-5 21:29
semantic-release     10-5 8:5
```

### Fetch from NPM registry

`npmlist` fetches the module's latest version by default, unless a version is specified

```
$ npmlist express

express@4.16.4's Dependencies:
├── accepts@1.3.5
├── array-flatten@1.1.1
```

### Turn off fuzzy mode

Fuzzy mode is rather poor at listing each item with detailed information that span more than one line. ```--nofuzzy``` mode flag is provided to simply print the output to terminal.

```
$ npmlist --nofuzzy

express@4.16.4
├── rimraf@2.6.2
│   A deep deletion module for node (like `rm -rf`)
│   git://github.com/isaacs/rimraf.git
│   https://github.com/isaacs/rimraf#readme
```

## Tests

To perform unit tests and integration tests, simply run `npm test`.

## Changelog

**2018-Oct-16:** Fuzzy mode is now enabled by default. It can be turned off by ```--nofuzzy```.

## Contribution

`npmlist` started off as a bunch of CLI aliases on top of `npm list` and `npm info`, but grew larger quickly. It's now very effective at checking out package's dependencies. Saying all these means we are not afraid of expanding `npmlist` features beyond the current realm.

The roadmap for `npmlist` now focuses on presenting a quick and concise report on terminal with minimal commands (it means no sub-commands), freeing developers from the burden of constant switching between terminal and browser. See [DOCS](./DOCS.md) for `npmlist`'s code architecture, developments rules, and styles.

## License

[ISC](./LICENSE.md)
