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

	// Five main features:
	.option('-l, --local', 'list local dependencies, which is also the default mode')
	.option('-g, --global', 'list global modules')
	.option('-d, --details', 'include details to each dependency, but disable the default interactive mode')
	.option('-t, --time', 'show the latest 5 modules installed globally')
	.option('-s, --scripts', 'list/execute npm scripts')

	// Fetch info from NPM registry
	.option('-a, --all [name]', 'show all information about a module fetched from NPM registry')

	// Mode
	.option('-f, --fuzzy', 'enable fuzzy mode, which is now default on most features')
	.option('-n, --nofuzzy', 'disable the fuzzy mode and resort to stdout')
	.option('-i, --interactive', 'enable interactive mode')

	// Help
	.on('--help', function () {
		console.log();
		console.log('  Examples:');
		console.log('    ' + chalk.blueBright(`npmlist, ${chalk.white('shows a fuzzy list of local dependencies')}`));
		console.log('    ' + chalk.blueBright(`npmlist -g -d, ${chalk.white('shows a detailed list of global modules')}`));
		console.log('    ' + chalk.blueBright(`npmlist [module], ${chalk.white("shows a fuzzy list of a module's dependencies fetched from registry")}`));
		console.log('    ' + chalk.blueBright(`npmlist [module] --all, ${chalk.white("shows all info about a module from npm registry")}`));
		console.log();
	})
	.parse(process.argv);


if (program.global) {
	(function listGlobalPackages() {
		if (!program.details) { // if details flag not specified
			if (!program.nofuzzy) { // if nofuzzy flag not specified
				npmList().global().fuzzy();
			} else {
				npmList().global().default();
			}
		} else {
			npmListDetails().global();
		}
	})();


} else if (program.local) {
	(function listLocalDependencies() {
		if (!program.details) { // if details flag not specified
			if (!program.nofuzzy) { // if nofuzzy flag not specified
				npmList().local().fuzzy();
			} else {
				npmList().local().default();
			}
		} else {
			npmListDetails().local();
		}
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
	if (!program.nofuzzy) { // If nofuzzy flag not specified
		npmScripts().fuzzy();
	} else {
		npmScripts().default();
	}


} else { // default mode when nothing specified...
	(function listLocalDependencies() {
		npmList().local().fuzzy();
	})();
}
