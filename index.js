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
} = require('./src/lib/date');

// a list of globally installed node modules
const list = ls('/usr/local/bin/lib/node_modules/*');

program
    .version('1.0.0', '-v, --version')
    .usage(`[option] [name]`)
    .description('Listing npm packages in cli made easy')
    .option('-g, --global', 'the command for npm list --global')
    .option('-l, --local', 'the command for npm list --local')
    .option('-i, --info', 'the command for what used to be npmlist --long')
    .option('-t, --time', 'the command for what used to be npmlatest, showing the five last globally installed npm packages')
    .option('-d, --docs <args>', 'the command for a pretty print of docs/information from the given package')
    .on('--help', function () {
        console.log();
        console.log('  Examples:');
        console.log('    ' + chalk.blueBright(`npmlist -i -l, ${chalk.white('shows a detailed list of local modules/dependencies')}`));
        console.log('    ' + chalk.blueBright(`npmlist [args], ${chalk.white("shows a module's dependencies from npm registry API")}`));
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

} else if (program.time) { // Select only the latest 10 download packages
    const result = sortByDate(list).slice(0, 10).map((item) => {
        return {
            'name': item.name,
            'time': parseDate(item.stat.mtime)
        };
    });
    console.log(columnify(result));

} else if (program.info) {
    execInfo('--local');

} else if (program.docs || program.args.length > 0) { // If a specific package is provided
    // both independent args and '--doc args' can be used to retrieve a module's dependencies info
    const module = program.docs ? program.docs : program.args;

    https.get('https://registry.npmjs.org/' + module, function (res) {
        if (res.statusCode !== 200) {
            res.destroy();
            console.log(chalk.redBright('Registry returned ' + res.statusCode));
            return;
        }

        let buffers = [];
        res.on('data', buffers.push.bind(buffers));
        res.on('end', function () {
            let data = Buffer.concat(buffers);
            const versions = Object.keys(JSON.parse(data).versions);
            const latestVersion = versions[versions.length - 1];
            const dependencies = JSON.parse(data).versions[latestVersion].dependencies;

            if (dependencies) {
                console.log(chalk.blueBright(`${module}'s dependencies:`));
                console.log(columnify(dependencies, {
                    columns: ['MODULE', 'VERSION']
                }));
            } else {
                console.log(chalk.blueBright(`${module} has no dependencies`));
            }
        });
    });

} else { // If nothing specified...
    exec('--local');
}


// --docs searches npm api for the detailed info of the given package



// Helper methods
function exec(option) {
    const cmd = 'npm list --depth=0 ' + option;
    execChildProcess(cmd, function (error, stdout, stderr) {
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
}
