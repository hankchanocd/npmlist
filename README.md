# npmlist  &nbsp;&nbsp;  [![Build Status](https://travis-ci.org/hankchanocd/npmlist.svg?branch=master)](https://travis-ci.org/hankchanocd/npmlist)  [![Known Vulnerabilities](https://snyk.io/test/github/hankchanocd/npmlist/badge.svg?targetFile=package.json)](https://snyk.io/test/github/hankchanocd/npmlist?targetFile=package.json)  ![Github issues](https://img.shields.io/github/issues/hankchanocd/npmlist.svg)

> A CLI that lists everything listable from any npm package, i.e. dependencies, scripts, profile.

Advantages over cluttered ```npm list``` and ```npm info```:

1. A replacement for ```npm list --depth=0 --local``` and other annoyingly long ```npm list --@#$%``` commands with assumed configurations
2. Richer and more dev-relevant information than ```npm info <package>```
3. List npm scripts better than ```npm run-script```
4. No need to leave terminal just for glancing at a package's npm profile

## Install

```bash
$ npm install -g @hankchanocd/npmlist
```

## Usage

```
Usage: npmlist [option] [name]

Listing information of npm packages at command line

Options:

  -v, --version     output the version number
  -l, --local       list local dependencies, which is also the default mode
  -g, --global      list global modules
  -d, --details     include details to each dependency, but disable the default interactive mode
  -t, --time        show the latest 5 modules installed globally
  -a, --all [name]  show all information about a module fetched from NPM registry
  -s, --scripts     list/execute npm scripts
  -h, --help        output usage information
```

## Examples

### Global modules

```bash
$ npmlist -g

/usr/local/bin/lib
├── @angular/cli@6.2.4
├── aerobatic-cli@1.1.4
```

### Recently installed/upgraded global modules

A good refresher on what the heck you've installed/upgraded globally in the recent past

```bash
$ npmlist -t

NAME                 TIME
npmlist-cli          10-5 21:29
semantic-release     10-5 8:5
```

### Fetch from NPM registry

`npmlist` fetches the latest released version by default

```
$ npmlist express

express@4.16.4's Dependencies:
├── accepts@1.3.5
├── array-flatten@1.1.1
```

### List module's npm scripts

```
$ npmlist -s

express@4.16.4
build: babel src/ -d build/ --quiet
test: mocha
```

## Tests

To perform unit tests and integration tests, simply run ```npm test```.

## Changelog

**2018-Oct-16:** Interactive mode is now enabled by default

## Contribution

```npmlist``` started off as a bunch of CLI aliases on top of ```npm list``` and ```npm info```, but grew larger over time. It's now very effective at checking out package's dependencies. Saying all these means we are not afraid of expanding ```npmlist``` features.

The roadmap for ```npmlist``` now focuses on presenting a quick and concise report on terminal with minimal commands (it means no sub-commands), freeing developers from the burden of constant switching between terminal and browser. See [DOCS](./DOCS.md) for ```npmlist```'s code architecture, developments rules, and styles.

## License

[ISC](./LICENSE.md)
