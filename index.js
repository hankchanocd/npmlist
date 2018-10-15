#!/usr/bin/env node --harmony

'use strict';

// Dependencies
const program = require('commander');
const chalk = require('chalk');

// local modules
const {
    npmList,
    npmListInfo
} = require('./build/npm');

const {
    fetchModuleInfo
} = require('./build/https.js');

const {
    getRecentInstalls
} = require('./build/time');


program
    .version('2.0.0', '-v, --version')
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
        npmList().global();
    } else {
        npmListInfo().global();
    }

} else if (program.local) {
    if (!program.info) {
        npmList().local();
    } else {
        npmListInfo().local();
    }

} else if (program.time) { // Select only the latest 10 download packages
    getRecentInstalls();

} else if (program.info) {
    npmListInfo().local();

} else if (program.docs || program.args.length > 0) { // If a specific package is provided
    // both independent args and '--doc args' can be used to retrieve a module's dependencies info
    const module = program.docs ? program.docs : program.args;
    fetchModuleInfo(module);

} else { // If nothing specified...
    npmList().local();
}


// --docs searches npm api for the detailed info of the given package
