# DOCS

## ⛏ Anatomy

1. Development takes place at ```src/```, while production files are served from ```build/```, created with ```babel```.

2. This module can be imported from ```build/index.js```

3. CLI is executed from ```bin/cli.js```

## ⛏ Development Rules

### Files/Directories

1. New features that warrant a new source file should be created with prefix `npm`, i.e. `npmScripts.js`

2. New features that don't warrant a new file should be appended to the existing ```src/``` files

3. Watch out for the ```src/``` files exports. Some allow multiple objects exports, some allows only one.

4. All new utilities should be placed in ```src/utils```

### CLI

1. New CLI features should be created with flags. Watch out for alphabets that have already been used in production; new flags shall avoid any namespace collision.

2. Unless agreed by the author, existing flags and its corresponding features shall not be changed for backward compatibility. No surprise behaviors to the end users.

3. A new major release will be triggered by ```semantic-version``` once new features break backward compatibility.

## ⛏ Architecture

### Chain Operations

It provides the benefits for future expansion flexibility, while offloading common operations to the holding function. Obviously it has pros and cons, but we decided it over the holding object pattern.

1. Don't write `npmlist.local()`, write `npmlist().local()` instead

2. An great example from [```src/npmDependencies.js```](/src/npmDependencies.js)

    ```js
    module.exports.npmListDetails = function () {
        const cmd = 'npm ll --depth=0 --long=true ';

        return {
            local() {
                ...
            global() {
                ...
            }
        };
    };
    ```

### Minimalist Approach

 ```npmlist``` CLI is created with the sole purpose of making CLI typing simpler and more intuitive.

1. We prohibit the use of sub-commands, making sure the desired output has the shortest distance from your muscle memory.

2. Therefore, new features should be called with flags only.

3. See below for examples.

    ```bash
    Usage: npmlist [option] [name]

    lists everything listable from npm package at command line

    Options:

    -v, --version     output the version number
    -l, --local       list local dependencies, which is also the default mode
    -g, --global      list global modules
    -d, --details     include details to each dependency, but disable the default interactive mode
    -t, --time        show the latest 5 modules installed globally
    ```

##  ⛏ Styles

### UnderstandMyCodeIn5Mins

For easy open source collaborations, we are asking contributors to write easy-to-understand code. It helps others to be quickly on board with your code, and it helps future maintenance years from now.

1. We particularly pride at following the **Clean Code** patterns.

2. Write well-names functions over comments.

3. Comments should still be used for notes about workarounds, unique code patterns, and performance improvements. It'll be hard for future maintenance without these comments.
