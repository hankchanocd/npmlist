/**
 * npmLocal.js provides methods that are running npm commands underneath in the local environment
 * See npmRegistry.js for methods fetching module info from NPM registry
 *
 */
'use strict';

// Dependencies
const execChildProcess = require('child_process').exec;
const chalk = require('chalk');
const pkgInfo = require('pkginfo');
const cwd = process.cwd();

/**
 * Output npm list with 2 options provided: local() and global()
 * i.e. npmList().local()
 */
module.exports.npmList = function () {

	return {
		local() {
			// Use pkgInfo to get package.json dependencies value. Parsing package.json for dependencies is faster
			// than running `npm list`
			try {
				let pkg = {
					exports: {}
				};
				pkgInfo(pkg, {
					dir: cwd,
					include: ["name", "version", "dependencies", "devDependencies"]
				});

				// Print
				getLocalList(pkg).forEach(i => console.log(i));

			} catch (e) {
				console.log("No package.json found");
			}
		},

		global() {
			execChildProcess('npm list --depth=0 --global', function (error, stdout, stderr) {
				printGlobalList(error, stdout, stderr);
			});
		}
	};
};

function getLocalList({
	exports: {
		name,
		version,
		dependencies,
		devDependencies
	}
} = {
	exports: {}
}) {
	let list = [];

	(function printTitle() {
		if (name) {
			if (version) {
				console.log(chalk.blueBright(name + '@' + version));
			} else {
				console.log(name);
			}
		}
	})();

	if (dependencies) {
		list.push((chalk.underline('Dependencies')));
		list = list.concat(styleDeps(dependencies));
	}

	if (devDependencies) {
		list.push((chalk.underline('DevDependencies')));
		list = list.concat(styleDeps(devDependencies));
	}

	return list;

	function styleDeps(deps = []) {
		return Object.keys(deps).map(key => {
			let value = deps[key] ? deps[key].replace(/[^0-9.,]/g, "") : '';
			return '├── ' + key + '@' + chalk.grey(value);
		});
	}
}

function printGlobalList(error, stdout, stderr) {
	if (error) { // Don't return if erred for `npm ERR! peer dep missing:` might occur, which is normal
		console.log(chalk.red.bold.underline("exec error:") + error);
	}
	if (stdout) {
		return console.log(chalk.white(stdout));
	}
	if (stderr) {
		return console.log(chalk.red("Error: ") + stderr);
	}
}


/**
 * Run `npm list --long=true` with 2 options provided: local() and global()
 * i.e. npmListDetails().global()
 */
module.exports.npmListDetails = function () {
	const cmd = 'npm ll --depth=0 --long=true ';

	return {
		local() {
			execChildProcess(cmd + '--local', function (error, stdout, stderr) {
				printNpmListDetails(error, stdout, stderr);
			});
		},
		global() {
			execChildProcess(cmd + '--global', function (error, stdout, stderr) {
				printNpmListDetails(error, stdout, stderr);
			});
		}
	};
};

function printNpmListDetails(error, stdout, stderr) {
	if (error) { // Don't return if erred for `npm ERR! peer dep missing:` might occur, which is normal
		console.log(chalk.red.bold.underline("exec error:") + error);
	}
	if (stdout) {
		// Print
		return parseNpmListDetails(stdout).forEach(i => {
			console.log(i);
		});
	}
	if (stderr) {
		return console.log(chalk.red("Error: ") + stderr);
	}
}

function parseNpmListDetails(stdout) {
	const lines = stdout.split('\n');

	return lines.map(i => {
		if (isTitle(i)) {
			return chalk.blueBright(i);
		} else if (isAddress(i)) {
			return chalk.grey(i);
		} else if (isSymlink(i)) {
			return chalk.magenta(i);
		} else {
			return i;
		}
	});

	function isTitle(i) {
		return i.includes('@') && !i.includes('->') && !i.includes('//');
	}

	function isAddress(i) { // hosted addresses, i.e. Github, Bitbucket, Gitlab
		return i.includes('//');
	}

	function isSymlink(i) {
		return i.includes('@') && i.includes('->');
	}
}


/**
 * Print npm tasks
 */
module.exports.npmScripts = function () {

	try {
		let pkg = {
			exports: {}
		};

		// Use pkgInfo to retrieve scripts from package.json
		pkgInfo(pkg, {
			dir: cwd,
			include: ["name", "version", "scripts"]
		});

		// Print
		getNpmScripts(pkg).forEach(i => console.log(i));

	} catch (e) {
		console.log(chalk.redBright('package.json not found'));
	}
};

function getNpmScripts({
	exports: {
		name,
		version,
		scripts
	}
} = {
	exports: {}
}) {
	(function printTitle() {
		if (name) {
			if (version) {
				return console.log(chalk.blueBright(name + '@' + version));
			}
			return console.log(name);
		}
	})();

	if (!scripts) {
		return [chalk.blueBright('Module has no scripts')];
	}

	return Object.keys(scripts).sort().map(key => {
		let value = scripts[key] ? scripts[key] : '';
		return chalk.cyan(key) + ': ' + value;
	});
}
