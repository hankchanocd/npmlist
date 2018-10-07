/**
 * npm.js provides methods that are running npm commands underneath in the local environment
 * See https.js for methods fetching info from npm registry
 *
 */

// Dependencies
const execChildProcess = require('child_process').exec;
const chalk = require('chalk');

/* Run `npm list` */
module.exports.execNpmList = function (option) {
    const cmd = 'npm list --depth=0 ' + option;

    execChildProcess(cmd, function (error, stdout, stderr) {
        printNpmList(error, stdout, stderr);
    });
};

function printNpmList(error, stdout, stderr) {
    if (error) { // Don't return if errored for `npm ERR! peer dep missing:` might occur, which is normal
        console.log(chalk.red.bold.underline("exec error:") + error);
    }
    if (stdout) {
        return console.log(chalk.white(stdout));
    }
    if (stderr) {
        return console.log(chalk.red("Error: ") + stderr);
    }
}


/* Run `npm list --long=true` */
module.exports.execNpmListInfo = function (option) {
    const cmd = 'npm ll --depth=0 --long=true ' + option;

    execChildProcess(cmd, function (error, stdout, stderr) {
        printNpmListInfo(error, stdout, stderr);
    });
};

function printNpmListInfo(error, stdout, stderr) {
    if (error) { // Don't return if errored for `npm ERR! peer dep missing:` might occur, which is normal
        console.log(chalk.red.bold.underline("exec error:") + error);
    }
    if (stdout) {
        return parseNpmListInfo(stdout).forEach(i => {
            console.log(i);
        });;
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