/**
 * npm.js provides methods that are running npm commands underneath in the local environment
 * See https.js for methods fetching info from npm registry
 *
 */

// Dependencies
const execChildProcess = require('child_process').exec;
const chalk = require('chalk');


module.exports.execNpmList = function (option) {
    const cmd = 'npm list --depth=0 ' + option;
    execChildProcess(cmd, function (error, stdout, stderr) {
        if (stdout) console.log(chalk.white(stdout));
        if (stderr) console.log(chalk.red("Error: ") +
            stderr);
    });
};

module.exports.execNpmListInfo = function (option) {
    const cmd = 'npm ll --depth=0 --long=true ' + option;
    execChildProcess(cmd, function (error, stdout, stderr) {
        if (error) console.log(chalk.red.bold.underline("exec error:") +
            error);
        if (stdout) {
            const lines = stdout.split('\n');
            lines.forEach((i) => {

                if (i.includes('@') && !i.includes('->') && !i.includes('//')) { // titles
                    console.log(chalk.redBright(i));
                } else if (i.includes('//')) { // hosted addresses, i.e. github, bitbucket, gitlab
                    console.log(chalk.grey(i));
                } else if (i.includes('@') && i.includes('->')) { // symlinked packages
                    console.log(chalk.magenta(i));
                } else console.log(i);
            });
        }
        if (stderr) console.log(chalk.red("Error: ") +
            stderr);
    });
};
