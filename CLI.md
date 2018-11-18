# CLI

(Deprecated)

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
