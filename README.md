# npmlist
A light-weight cli tool listing npm package dependencies and package profile.

Advantages over ```npm list``` and ```npm info <package>```
1. A shortcut for ```npm list``` with assumed configurations
2. no more digging into the returned gigantic json data of ```npm info <package>```
3. no need to leave terminal for the quick overview of npm package profile

# Install

```
npm install npmlist
```

# Usage

### Globally installed packages
```bash
npmlist -g
```

### Local package dependencies
```bash
cd folder
npmlist 
```

### Display detailed local package dependencies
```bash
cd folder
npmlist --info
```

### Recently installed packages
```bash
npmlist -t

# Result
NAME              TIME
npmlist-cli       4-9 2:18
surl              4-8 20:45
```

### Fetch a npm package's profile from npm registry
```bash
npmlist express
```

# License

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
