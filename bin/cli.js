#!/usr/bin/env node --harmony

'use strict';

// Dependencies
const program = require('commander');
const chalk = require('chalk');

// Local dependencies
const {
	npmDependencies,
	npmScripts,
	npmRegistry,
	npmRecent
} = require('./../build/index');
const {
	npmList,
	npmListDetails
} = npmDependencies;


program
	.version('3.0.0', '-v, --version')
	.usage(`[option] [name]`)
	.description('A fuzzy CLI that lists everything listable from any npm package')
	.option('-l, --local', 'list local dependencies, which is also the default mode')
	.option('-g, --global', 'list global modules')
	.option('-d, --details', 'include details to each dependency, but disable the default interactive mode')
	.option('-t, --time', 'show the latest 5 modules installed globally')
	.option('-a, --all [name]', 'show all information about a module fetched from NPM registry')
	.option('-s, --scripts', 'list/execute npm scripts')
	.option('-i, --interactive', 'enable interactive/fuzzy mode, which is now default')
	.option('-n, --no-fuzzy', 'disable the fuzzy mode and resort to stdout')
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
		!program.details ? npmList().global().fuzzy() : npmListDetails().global();
	})();


} else if (program.local) {
	(function listLocalDependencies() {
		!program.details ? npmList().local().fuzzy() : npmListDetails().local();
	})();


} else if (program.time) { // Select only the 10 latest installed packages
	npmRecent();


} else if (program.details) { // Default to npm local packages listing if only --details flag present
	npmListDetails().local();


} else if (program.args.length > 0) { // execute if a module is specified, i.e. `npmlist express --all`
	(function fetchModuleInfoFromNpmRegistry() {
		const module = program.args;
		!program.all ? npmRegistry(module).simple() : npmRegistry(module).all();
	})();


} else if (program.all) { // Same functionality as above but for reverse args-flags order, i.e. `npmlist --all express`
	(function fetchModuleInfoFromNpmRegistry() {
		if (process.argv.length > 1) {
			const module = process.argv[process.argv.length - 1];
			npmRegistry(module).all();
		}
	})();


} else if (program.scripts) {
	npmScripts().fuzzy();


} else { // default mode when nothing specified...
	(function listLocalDependencies() {
		npmList().local().fuzzy();
	})();
}
