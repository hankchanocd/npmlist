#!/usr/bin/env node --harmony

const ls = require('ls');
const columnify = require('columnify');
const program = require('commander');
const chalk = require('chalk');
const execChildProcess = require('child_process').exec;
var read = require('read-file');

// local modules
const {
    sortByDate,
    parseDate
} = require('./lib/date');

// a list of globally installed node modules
const list = ls('/usr/local/bin/lib/node_modules/*');

program
    .version('1.0.0', '-v, --version')
    .usage(`[option]`)
    .description('Listing npm packages in cli made easy')
    .option('-g, --global', 'the command for npm list --global')
    .option('-l, --local', 'the command for npm list --local')
    .option('-i, --info', 'the command for what used to be npmlist --long')
    .option('-t, --time', 'the command for what used to be npmlatest, showing the five last globally installed npm packages')
    .on('--help', function () {
        console.log();
        console.log('  ' + chalk.redBright('This program has not yet provided any subcommands but plan to release some in the future.'));
        console.log();
    })
    .parse(process.argv);


// Listing of installed packages are executed through 'child_process'
let cmd = 'npm list --depth=0 ';
if (program.global) {
    cmd += '--global';
    exec(cmd);
} else if (program.local) {
    cmd += '--local';
    exec(cmd);
} else if (program.time) {
    // Select only the latest 5 download packages
    const result = sortByDate(list).slice(0, 5).map((item) => {
        return {
            'name': item.name,
            'time': parseDate(item.stat.mtime)
        };
    });
    console.log(columnify(result));
} else if (program.info) {
    // sync 
    var buffer = read.sync('lib/npminfo.sh', 'utf8');
    exec(buffer);
} else {
    // If nothing specified...
    cmd += '--local';
    exec(cmd);
}


// Helper methods
function exec(command) {
    execChildProcess(command, function (error, stdout, stderr) {
        if (error) console.log(chalk.red.bold.underline("exec error:") +
            error);
        if (stdout) console.log(chalk.white(stdout));
        if (stderr) console.log(chalk.red("Error: ") +
            stderr);
    });
}