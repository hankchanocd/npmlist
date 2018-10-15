/**
 * npm.js provides methods that are running npm commands underneath in the local environment
 * See https.js for methods fetching info from npm registry
 *
 */
'use strict';

// Dependencies
const execChildProcess = require('child_process').exec;
const chalk = require('chalk');
const pkgInfo = require('pkginfo');
const cwd = process.cwd();

/**
 * Run `npm list` with 2 options provided: local() and global()
 * i.e. npmList().local()
 */
module.exports.npmList = function () {
    const cmd = 'npm list --depth=0 ';

    return {
        local() {
            // Use pkgInfo to get package.json dependencies value. Parsing package.json is faster than `npm list`
            try {
                let pkg = {
                    exports: {}
                };
                pkgInfo(pkg, {
                    dir: cwd,
                    include: ["name", "dependencies", "devDependencies"]
                });
                let name = pkg.exports.name;
                let dependencies = pkg.exports.dependencies;
                let devDependencies = pkg.exports.devDependencies;
                Object.assign(dependencies, devDependencies); // Merge into the first object

                // Output
                console.log(name);
                Object.keys(dependencies).sort().forEach(key => {
                    let value = dependencies[key].replace(/[^0-9.,]/g, "");
                    return console.log('├── ' + key + '@' + chalk.grey(value));
                });

            } catch (e) {
                console.log("No package.json found");
            }
        },
        global() {
            execChildProcess(cmd + '--global', function (error, stdout, stderr) {
                printNpmList(error, stdout, stderr);
            });
        }
    };
};

function printNpmList(error, stdout, stderr) {
    if (error) { // Don't return if erred for `npm ERR! peer dep missing:` might occur, which is normal
        console.log(chalk.red.bold.underline("exec error:") + error);
    }
    if (stdout) {
        return console.log(chalk.white(stdout));
    }
    if (stderr) {
        return console.log(chalk.red("Error: ") + stderr);
    }
}


/**
 * Run `npm list --long=true` with 2 options provided: local() and global()
 * i.e. npmListInfo().global()
 */
module.exports.npmListInfo = function () {
    const cmd = 'npm ll --depth=0 --long=true ';

    return {
        local() {
            execChildProcess(cmd + '--local', function (error, stdout, stderr) {
                printNpmListInfo(error, stdout, stderr);
            });
        },
        global() {
            execChildProcess(cmd + '--global', function (error, stdout, stderr) {
                printNpmListInfo(error, stdout, stderr);
            });
        }
    };
};

function printNpmListInfo(error, stdout, stderr) {
    if (error) { // Don't return if erred for `npm ERR! peer dep missing:` might occur, which is normal
        console.log(chalk.red.bold.underline("exec error:") + error);
    }
    if (stdout) {
        return parseNpmListInfo(stdout).forEach(i => {
            console.log(i);
        });
    }
    if (stderr) {
        return console.log(chalk.red("Error: ") + stderr);
    }
}

function parseNpmListInfo(stdout) {
    const lines = stdout.split('\n');

    return lines.map(i => {
        if (isTitle(i)) {
            return chalk.redBright(i);
        } else if (isAddress(i)) {
            return chalk.grey(i);
        } else if (isSymlink(i)) {
            return chalk.magenta(i);
        } else {
            return i;
        }
    });

    function isTitle(i) {
        return i.includes('@') && !i.includes('->') && !i.includes('//');
    }

    function isAddress(i) { // hosted addresses, i.e. Github, Bitbucket, Gitlab
        return i.includes('//');
    }

    function isSymlink(i) {
        return i.includes('@') && i.includes('->');
    }
}


/**
 * Print npm tasks
 */
module.exports.npmScripts = function () {

    try {
        let pkg = {
            exports: {}
        };

        // Use pkgInfo to retrieve tasks/scripts from package.json
        pkgInfo(pkg, {
            dir: cwd,
            include: ["name", "scripts"]
        });
        let name = pkg.exports.name;
        let scripts = pkg.exports.scripts;

        // Output
        console.log(name);
        Object.keys(scripts).sort().forEach(key => {
            return console.log(chalk.cyan(key) + ': ' + scripts[key]);
        });

    } catch (e) {
        console.log("No package.json found");
    }
};
