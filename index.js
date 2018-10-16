#!/usr/bin/env node --harmony

'use strict';

// Dependencies
const program = require('commander');
const chalk = require('chalk');

// local modules
const {
	npmList,
	npmListDetails,
	npmScripts
} = require('./build/npmLocal.js');

const {
	fetchModule
} = require('./build/npmRegistry.js');

const {
	getRecentInstalls
} = require('./build/npmRecent.js');


program
	.version('3.0.0', '-v, --version')
	.usage(`[option] [name]`)
	.description('lists everything listable from npm package at command line')
	.option('-l, --local', 'list local dependencies, which is also the default mode')
	.option('-g, --global', 'list global modules')
	.option('-d, --details', 'include details to each dependency, but disable the default interactive mode')
	.option('-t, --time', 'show the latest 5 modules installed globally')
	.option('-a, --all [name]', 'show all information about a module fetched from NPM registry')
	.option('-s, --scripts', 'list/execute npm scripts')
	.on('--help', function () {
		console.log();
		console.log('  Examples:');
		console.log('    ' + chalk.blueBright(`npmlist, ${chalk.white('shows a list of local dependencies')}`));
		console.log('    ' + chalk.blueBright(`npmlist -g -d, ${chalk.white('shows a detailed list of global modules')}`));
		console.log('    ' + chalk.blueBright(`npmlist [module], ${chalk.white("shows dependencies of a module from npm registry")}`));
		console.log('    ' + chalk.blueBright(`npmlist [module] --all, ${chalk.white("shows all info about a module from npm registry")}`));
		console.log();
	})
	.parse(process.argv);


if (program.global) {
	(function listGlobalPackages() {
		!program.details ? npmList().global() : npmListDetails().global();
	})();


} else if (program.local) {
	(function listLocalDependencies() {
		!program.details ? npmList().local() : npmListDetails().local();
	})();


} else if (program.time) { // Select only the 10 latest installed packages
	getRecentInstalls();


} else if (program.details) { // Default to npm local packages listing if only --details flag present
	npmListDetails().local();


} else if (program.args.length > 0) { // execute if a module is specified, i.e. `npmlist express --all`
	(function fetchModuleInfoFromNpmRegistry() {
		const module = program.args;
		!program.all ? fetchModule(module).simple() : fetchModule(module).all();
	})();


} else if (program.all) { // Same functionality as above but for reverse args-flags order, i.e. `npmlist --all express`
	(function fetchModuleInfoFromNpmRegistry() {
		if (process.argv.length > 1) {
			const module = process.argv[process.argv.length - 1];
			fetchModule(module).all();
		}
	})();


} else if (program.scripts) {
	npmScripts();


} else { // default mode when nothing specified...
	(function listLocalDependencies() {
		npmList().local();
	})();
}
