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
	.version('4.0.0', '-v, --version')
	.usage(`[option] [name]`)
	.description('A fuzzy CLI that lists everything listable from any npm package')

	// Five main features:
	.option('-l, --local', 'list local dependencies, which is also the default mode')
	.option('-g, --global', 'list global modules')
	.option('-d, --details', 'include details to each dependency, but disable the default fuzzy mode')
	.option('-t, --time', 'show the latest 20 modules installed globally')
	.option('-s, --scripts', 'list/execute npm scripts')

	// Flavor flag
	.option('-a, --all', 'a flavor flag that shows all available information on any feature flags')

	// Mode
	.option('-F, --no-fuzzy', 'disable the default fuzzy mode and resort to stdout')
	.option('-i, --interactive', 'enable interactive mode (in development)')

	// Help
	.on('--help', function () {
		console.log();
		console.log('  Examples:');
		console.log('    ' + chalk.blueBright(`npmlist, ${chalk.white('show a fuzzy list of local dependencies')}`));
		console.log('    ' + chalk.blueBright(`npmlist -t, ${chalk.white('show a fuzzy list of 20 latest global installs')}`));
		console.log('    ' + chalk.blueBright(`npmlist -s --no-fuzzy, ${chalk.white("show a normal list of all the npm scripts")}`));
		console.log('    ' + chalk.blueBright(`npmlist -g --details, ${chalk.white('show a normal, detailed list of global modules')}`));
		console.log('    ' + chalk.blueBright(`npmlist [module], ${chalk.white("show a fuzzy list of a module's dependencies fetched from registry")}`));
		console.log();
	})
	.parse(process.argv);


if (program.global) {
	(function listGlobalPackages() {
		if (!program.details) { // if details flag not specified
			if (program.fuzzy) {
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
			if (program.fuzzy) {
				npmList().local().fuzzy();
			} else {
				npmList().local().default();
			}
		} else {
			npmListDetails().local();
		}
	})();


} else if (program.time) { // Select only the 20 latest installed packages
	if (!program.all) {
		if (program.fuzzy) {
			npmRecent().then(i => i.recentTwenty()).then(i => i.fuzzy()).catch(err => console.log(err));
		} else {
			npmRecent().then(i => i.recentTwenty()).then(i => i.default()).catch(err => console.log(err));
		}
	} else { // Only if all flag specified
		if (program.fuzzy) {
			npmRecent().then(i => i.all()).then(i => i.fuzzy()).catch(err => console.log(err));
		} else {
			npmRecent().then(i => i.all()).then(i => i.default()).catch(err => console.log(err));
		}
	}


} else if (program.details) { // Default to npm local packages listing if only --details flag present
	npmListDetails().local();


} else if (program.args.length > 0) { // execute if a module is specified, i.e. `npmlist express --all`
	(function fetchModuleInfoFromNpmRegistry() {
		const module = program.args;
		if (!program.all) {
			if (program.fuzzy) {
				npmRegistry(module).then(i => i.simple().fuzzy()).catch(err => console.log(chalk.redBright(err)));
			} else {
				npmRegistry(module).then(i => i.simple().default()).catch(err => console.log(chalk.redBright(err)));
			}
		} else {
			npmRegistry(module).then(i => i.all()).catch(err => console.log(chalk.redBright(err)));
		}
	})();


} else if (program.scripts) {
	if (program.fuzzy) {
		npmScripts().fuzzy();
	} else {
		npmScripts().default();
	}


} else if (program.all) { // If none of the feature flags were detected but --all ...
	// --all is a flavor flag. It has no meaning if standing alone
	console.log(`Please specify a feature`);


} else { // default mode when nothing specified...
	(function listLocalDependencies() {
		npmList().local().fuzzy();
	})();
}
