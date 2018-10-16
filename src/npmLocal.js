/**
 * npm.js provides methods that are running npm commands underneath in the local environment
 * See https.js for methods fetching info from npm registry
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
			// Use pkgInfo to get package.json dependencies value. Parsing package.json is faster than running `npm list`
			try {
				let pkg = {
					exports: {}
				};
				pkgInfo(pkg, {
					dir: cwd,
					include: ["name", "version", "dependencies", "devDependencies"]
				});
				printLocalList(parseLocalList(pkg));

			} catch (e) {
				console.log("No package.json found");
			}
		},
		global() {
			const cmd = 'npm list --depth=0 ';

			execChildProcess(cmd + '--global', function (error, stdout, stderr) {
				printGlobalList(error, stdout, stderr);
			});
		}
	};
};

function parseLocalList(pkg) {
	return {
		name: pkg.exports.name ? pkg.exports.name : '',
		version: pkg.exports.version ? pkg.exports.version : '',
		dependencies: pkg.exports.dependencies ? pkg.exports.dependencies : '',
		devDependencies: pkg.exports.devDependencies ? pkg.exports.devDependencies : ''
	};
}

function printLocalList(result) {
	if (result.name) {
		if (result.version) {
			console.log(chalk.blueBright(result.name + '@' + result.version));
		} else {
			console.log(result.name);
		}
	}

	if (result.dependencies) {
		console.log(chalk.underline('Dependencies'));
		print(result.dependencies);
	}

	if (result.devDependencies) {
		console.log(chalk.underline('DevDependencies'));
		print(result.devDependencies);
	}

	function print(dependencies) {
		Object.keys(dependencies).forEach(key => {
			let value = dependencies[key] ? dependencies[key].replace(/[^0-9.,]/g, "") : '';
			return console.log('├── ' + key + '@' + chalk.grey(value));
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
 * i.e. npmListInfo().global()
 */
module.exports.npmListInfo = function () {
	const cmd = 'npm ll --depth=0 --long=true ';

	return {
		local() {
			execChildProcess(cmd + '--local', function (error, stdout, stderr) {
				printNpmListInfo(error, stdout, stderr);
			});
		},
		global() {
			execChildProcess(cmd + '--global', function (error, stdout, stderr) {
				printNpmListInfo(error, stdout, stderr);
			});
		}
	};
};

function printNpmListInfo(error, stdout, stderr) {
	if (error) { // Don't return if erred for `npm ERR! peer dep missing:` might occur, which is normal
		console.log(chalk.red.bold.underline("exec error:") + error);
	}
	if (stdout) {
		return parseNpmListInfo(stdout).forEach(i => {
			console.log(i);
		});
	}
	if (stderr) {
		return console.log(chalk.red("Error: ") + stderr);
	}
}

function parseNpmListInfo(stdout) {
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

		// Use pkgInfo to retrieve tasks/scripts from package.json
		pkgInfo(pkg, {
			dir: cwd,
			include: ["name", "version", "scripts"]
		});

		printNpmScripts(pkg);

	} catch (e) {
		console.log("No package.json found");
	}
};

function printNpmScripts(result) {
	let name = result.exports.name ? result.exports.name : '';
	let version = result.exports.version ? result.exports.version : '';
	let scripts = result.exports.scripts ? result.exports.scripts : '';

	(function printTitle() {
		if (name) {
			if (version) {
				return console.log(chalk.blueBright(name + '@' + version));
			}
			return console.log(name);
		}
	})();
	(function printScripts() {
		Object.keys(scripts).sort().forEach(key => {
			let value = scripts[key] ? scripts[key] : '';
			return console.log(chalk.cyan(key) + ': ' + value);
		});
	})();
}
