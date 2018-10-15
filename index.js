#!/usr/bin/env node --harmony

'use strict';

// Dependencies
const program = require('commander');
const chalk = require('chalk');

// local modules
const {
    npmList,
    npmListInfo,
    npmScripts
} = require('./build/npmLocal.js');

const {
    fetchModule
} = require('./build/npmRegistry.js');

const {
    getRecentInstalls
} = require('./build/npmRecent.js');


program
    .version('2.0.0', '-v, --version')
    .usage(`[option] [name]`)
    .description('Listing information of npm packages at command line')
    .option('-l, --local', 'list local dependencies, which is also the default mode')
    .option('-g, --global', 'list global dependencies')
    .option('-i, --info', 'add information to dependencies list')
    .option('-t, --time', 'show the last five globally installed npm packages')
    .option('-a, --all [name]', 'show all npm packages')
    .option('-s, --scripts', 'list scripts/tasks')
    .on('--help', function () {
        console.log();
        console.log('  Examples:');
        console.log('    ' + chalk.blueBright(`npmlist -i -l, ${chalk.white('shows a detailed list of local modules/dependencies')}`));
        console.log('    ' + chalk.blueBright(`npmlist [args], ${chalk.white("shows dependencies of a module from npm registry")}`));
        console.log('    ' + chalk.blueBright(`npmlist [args] --all, ${chalk.white("shows all info about a module from npm registry")}`));
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

} else if (program.args.length > 0) { // If a package is specified
    // both independent args and '--doc args' can be used to retrieve a module's dependencies info
    const module = program.docs ? program.docs : program.args;

    if (!program.all) {
        fetchModule(module).simple();
    } else {
        fetchModule(module).all();
    }

} else if (program.scripts) {
    npmScripts();

} else { // If nothing specified...
    npmList().local();
}
