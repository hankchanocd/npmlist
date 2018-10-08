# npmlist  &nbsp;&nbsp;  [![Build Status](https://travis-ci.org/hankchanocd/npmlist.svg?branch=master)](https://travis-ci.org/hankchanocd/npmlist)
A light-weight CLI tool listing npm package dependencies and package profile.

Much of ```npmlist``` is build on top of ```npm``` commands, but it has some advantages over plain and cluttered ```npm list``` and ```npm info <package>```
1. A shortcut for ```npm list``` with assumed configurations
2. Richer and more development-relevant information than ```npm info <package>```
3. No need to leave terminal for glancing npm package profile

## Install

```
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
$ npmlist

surl-cli@1.2.0 /Users/hank/surl-cli
├── child_process@1.0.2
├── commander@2.18.0
├── jest@23.6.0
└── ls@0.2.1
```

### Show a colored list of local package dependencies with details
```bash
$ cd surl-cli
$ npmlist --info

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
A good refresher on what the heck you've installed/upgraded globally on your machine in the past few weeks
```bash
$ npmlist -t

NAME                 TIME
npmlist-cli          10-5 21:29
semantic-release     10-5 8:5
tty-table            10-5 8:5
```

### Fetch a npm package's profile from npm registry
```bash
$ npmlist express

express's dependencies:
MODULE     VERSION
columnify  ^1.5.4
commander  ^2.17.1
node-fetch ^2.2.0
```

## Tests
To run unit tests and API tests, run ```npm test```.

## Contribution
```npmlist``` was initially a bunch of CLI shortcuts aliased on top of ```npm list``` and ```npm info```, but grew larger over time. It has since got its own idea of how to integrate with the workflow of JavaScript development.

```npmlist``` is admittedly a tiny tool, but it has served me well and I believe it can be helpful to you if it fits your workflow. The development of ```npmlist``` will center on how to present a quick and concise report of npm packages on command line, while lifting the burden to move to browser.

## License
[ISC](./LICENSE.md)
