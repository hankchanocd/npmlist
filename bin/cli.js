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
	npmRecent,
	npmGlobal
} = require('./../build/index');
const {
	npmList,
	npmListDetails
} = npmDependencies;


program
	.version('7.0.0', '-v, --version')
	.usage(`[option] [name]`)
	.description('Fuzzy list anything listable with npm package')

	// Five main features:
	.option('-l, --local', 'list local dependencies, which is also the default feature')
	.option('-g, --global', 'list global modules')
	.option('-d, --details', 'include details to each dependency, but disable the default fuzzy mode')
	.option('-t, --time', 'show the latest global installs')
	.option('-s, --scripts', 'list/execute npm scripts')

	// Flavor flag
	.option('-a, --all', 'a flavor flag that shows all available information on any feature flag')

	// Mode
	.option('-i, --ipt', 'switch to use ipt instead of fzf')
	.option('-F, --no-fuzzy', 'disable the default fuzzy mode and resort to stdout')

	// Help
	.on('--help', function () {
		console.log();
		console.log('  Examples:');
		console.log('    ' + chalk.blueBright(`npl, ${chalk.white('a fuzzy list of local dependencies')}`));
		console.log('    ' + chalk.blueBright(`npl -t, ${chalk.white('a fuzzy list of latest global installs')}`));
		console.log('    ' + chalk.blueBright(`npl -s, ${chalk.white("a fuzzy list of npm scripts using fzf")}`));
		console.log('    ' + chalk.blueBright(`npl -s --ipt, ${chalk.white("a fuzzy list of npm scripts using ipt")}`));
		console.log('    ' + chalk.blueBright(`npl -s --no-fuzzy, ${chalk.white("a normal list of npm scripts")}`));
		console.log('    ' + chalk.blueBright(`npl -g --details, ${chalk.white('a normal, detailed list of global installs')}`));
		console.log('    ' + chalk.blueBright(`npl [module], ${chalk.white("a fuzzy list of a module's dependencies fetched from NPM registry")}`));
		console.log();
	})
	.parse(process.argv);


if (program.global) {
	listGlobalPackages();

} else if (program.local) {
	listLocalDependencies();

} else if (program.time) {
	listGlobalPackagesSortedByTime();

} else if (program.details) { // Default to npm local packages listing if only --details flag present
	npmListDetails();

} else if (program.args.length > 0) { // execute if a module is specified, i.e. `npl express --all`
	if (!program.args.length == 1) {
		console.log(chalk.blueBright('Only one module is allowed'));

	} else if (program.args.length == 1 && program.args[0] === '-') { // Typo of incomplete flag, i.e. 'npl -'
		console.log(chalk.blueBright('Invalid input'));

	} else {
		fetchModuleInfoFromNpmRegistry();
	}

} else if (program.scripts) {
	listNpmScripts();

} else if (program.all) {
	// If none of the feature flags were detected but --all ...
	// --all is a flavor flag. It has no meaning if standing alone
	console.log(`Please specify a feature`);

} else { // default is list local dependencies when nothing specified...
	listLocalDependencies();
}


/* Helper Functions */
function listGlobalPackages() {
	if (program.time) {
		return console.log('Use `npl -t` instead');
	}

	if (!program.details) { // if details flag not specified
		if (program.fuzzy) {
			if (!program.ipt) { // Default is fzf
				npmGlobal().then(i => i.simple().fuzzy()).catch(err => console.log(chalk.redBright(err)));
			} else if (program.ipt) { // Specify to use ipt
				npmGlobal().then(i => i.simple().ipt()).catch(err => console.log(chalk.redBright(err)));
			}
		} else {
			npmGlobal().then(i => i.simple().print()).catch(err => console.log(chalk.redBright(err)));
		}
	} else {
		npmGlobal().then(i => i.details()).catch(err => console.log(chalk.redBright(err)));
	}
}

function listGlobalPackagesSortedByTime() {
	if (program.fuzzy) {
		npmRecent().all().then(i => i.fuzzy()).catch(err => console.log(chalk.redBright(err)));
	} else {
		npmRecent().all().then(i => i.default()).catch(err => console.log(chalk.redBright(err)));
	}
}

function listLocalDependencies() {
	if (!program.details) { // if details flag not specified
		if (program.fuzzy) {
			if (!program.ipt) { // Default is fzf
				npmList().fuzzy();
			} else if (program.ipt) { // Specify to use ipt
				npmList().ipt();
			}
		} else {
			npmList().default();
		}
	} else {
		npmListDetails();
	}
}

function fetchModuleInfoFromNpmRegistry() {
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
}

function listNpmScripts() {
	if (program.fuzzy) {
		if (!program.ipt) { // Default is fzf
			npmScripts().fuzzy();
		} else if (program.ipt) { // Specify to use ipt
			npmScripts().ipt();
		}
	} else {
		npmScripts().default();
	}
}
