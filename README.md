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

### Show a list of global packages

```bash
$ npmlist -g

/usr/local/bin/lib
├── 0x@4.5.0
├── @angular/cli@6.2.4
├── aerobatic-cli@1.1.4
├── atomizer@3.4.8
...
```

### Show a list of local package dependencies

```bash
$ cd surl-cli
[~/surl-cli]$ npmlist

surl-cli@1.2.0
Dependencies
├── child_process@1.0.2
├── commander@2.18.0
├── jest@23.6.0
└── ls@0.2.1
```

### Show a list of local package dependencies with details

```
$ cd surl-cli
[~/surl-cli]$ npmlist --info

surl-cli@1.2.0
│ /Users/hank/surl-cli
│ URL shortener CLI
│ git+https://github.com/hankchanocd/surl-cli.git
│ https://github.com/hankchanocd/surl-cli#readme
├── babel-cli@6.26.0
│   Babel command line.
│   https://github.com/babel/babel/tree/master/packages/babel-cli
│   https://babeljs.io/
...
```

### Show global packages recently installed/upgraded

A good refresher on what the heck you've installed/upgraded globally on your machine in the recent past

```bash
$ npmlist -t

NAME                 TIME
npmlist-cli          10-5 21:29
semantic-release     10-5 8:5
tty-table            10-5 8:5
```

### Fetch a npm package's profile from npm registry

```
$ npmlist express

express's Dependencies:
├── accepts@1.3.5
├── array-flatten@1.1.1
├── body-parser@1.18.3
```

### List npm scripts

```
$ npmlist -s

express@1.2.0
build: babel src/ -d build/ --quiet
commit: git-cz
test: mocha
```

## Tests

To perform unit tests and integration tests, simply run ```npm test```.

## Contribution

```npmlist``` started off as a bunch of CLI aliases on top of ```npm list``` and ```npm info```, but grew larger over time. It has since become very effective at checking out package's dependencies.

The roadmap for ```npmlist``` will now focus on presenting a quick and concise report on terminal with minimal commands (it means no sub-commands), freeing developers from the burden of constant moving between terminal and browser.

## License

[ISC](./LICENSE.md)
