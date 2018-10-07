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

### Show a detailed list of local package dependencies
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

### Show global packages recently installed
A good refresher on what the heck you've installed globally on your machine in the past few weeks
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
```npmlist``` was initially a bunch of CLI aliases on top of ```npm list``` and ```npm info```, but grew larger over time. It now has its own idea of how to integrate with the workflow of JavaScript development.

 ```npmlist``` is admittedly a tiny tool, but I use it all the time and believe it can be tremendously helpful if it fits your workflow. The development of ```npmlist``` will center on how to present a quick and concise report of npm packages on command line, while lifting the burden to move to browser.

## License

Copyright (c) 2018 Hank Chan <hankchanth@icloud.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
