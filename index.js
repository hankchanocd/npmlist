#!/usr/bin/env node --harmony

'use strict';

const ls = require('ls');
const https = require('https');
const columnify = require('columnify');
const program = require('commander');
const chalk = require('chalk');
const execChildProcess = require('child_process').exec;

// local modules
const {
    sortByDate,
    parseDate
} = require('./lib/date');

// a list of globally installed node modules
const list = ls('/usr/local/bin/lib/node_modules/*');

program
    .version('1.0.0', '-v, --version')
    .usage(`[package] [option]`)
    .description('Listing npm packages in cli made easy')
    .option('-g, --global', 'the command for npm list --global')
    .option('-l, --local', 'the command for npm list --local')
    .option('-i, --info', 'the command for what used to be npmlist --long')
    .option('-t, --time', 'the command for what used to be npmlatest, showing the five last globally installed npm packages')
    .option('-d, --docs <package>', 'the command for a pretty print of the detailed information from the given package')
    .on('--help', function () {
        console.log();
        console.log('  ' + chalk.blueBright('npmlist -i -l, shows the detailed list of local modules/dependencies'));
        console.log();
    })
    .parse(process.argv);


// Listing of installed packages are executed through 'child_process'
if (program.global) {
    if (!program.info) {
        exec('--global');
    } else {
        execInfo('--global');
    }

} else if (program.local) {
    if (!program.info) {
        exec('--local');
    } else {
        execInfo('--local');
    }

} else if (program.time) {
    // Select only the latest 10 download packages
    const result = sortByDate(list).slice(0, 10).map((item) => {
        return {
            'name': item.name,
            'time': parseDate(item.stat.mtime)
        };
    });
    console.log(columnify(result));

} else if (program.info) {
    execInfo('--local');

} else {
    // If nothing specified...
    exec('--local');
}





// Helper methods
function exec(option) {
    const cmd = 'npm list --depth=0 ' + option;
    execChildProcess(cmd, function (error, stdout, stderr) {
        if (error) console.log(chalk.red.bold.underline("exec error:") +
            error);
        if (stdout) console.log(chalk.white(stdout));
        if (stderr) console.log(chalk.red("Error: ") +
            stderr);
    });
}

function execInfo(option) {
    const cmd = 'npm ll --depth=0 --long=true ' + option;
    execChildProcess(cmd, function (error, stdout, stderr) {
        if (error) console.log(chalk.red.bold.underline("exec error:") +
            error);
        if (stdout) {
            const lines = stdout.split('\n');
            lines.forEach((i) => {

                if (i.includes('@') && !i.includes('/')) { // titles
                    console.log(chalk.redBright(i));
                } else if (i.includes('github')) { // hosted addresses
                    console.log(chalk.grey(i));
                } else if (i.includes('@') && i.includes('/')) { // syslinked packages
                    console.log(chalk.magenta(i));
                } else console.log(i);
            });
        }
        if (stderr) console.log(chalk.red("Error: ") +
            stderr);
    });
}