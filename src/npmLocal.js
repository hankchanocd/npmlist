/**
 * npmLocal.js list dependencies
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
				printNpmListFromExec(error, stdout, stderr);
			});
		}
	};
};


/**
 * Run `npm list --long=true` with 2 options provided: local() and global()
 * i.e. npmList.global()
 */
module.exports.npmListDetails = function () {
	const cmd = 'npm ll --depth=0 --long=true ';

	return {
		local() {
			execChildProcess(cmd + '--local', function (error, stdout, stderr) {
				printNpmListFromExec(error, stdout, stderr);
			});
		},
		global() {
			execChildProcess(cmd + '--global', function (error, stdout, stderr) {
				printNpmListFromExec(error, stdout, stderr);
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
		list = list.concat(styleDependencies(dependencies));
	}

	if (devDependencies) {
		list.push((chalk.underline('DevDependencies')));
		list = list.concat(styleDependencies(devDependencies));
	}

	return list;

	function styleDependencies(deps = []) {
		return Object.keys(deps).map(key => {
			let value = deps[key] ? deps[key].replace(/[^0-9.,]/g, "") : '';
			return '├── ' + key + '@' + chalk.grey(value);
		});
	}
}


/*
 * We are stuck with handling the callback instead of using async/await because npm cli, which we run underneath the
 * global command, is easy to blow up errors
 */
function printNpmListFromExec(error, stdout, stderr) {
	if (error) { // Don't return if erred for `npm ERR! peer dep missing:` might occur, which is normal
		console.log(chalk.red.bold.underline("exec error:") + error);
	}
	if (stdout) {
		// Print
		return parseNpmList(stdout).forEach(i => {
			console.log(i);
		});
	}
	if (stderr) {
		return console.log(chalk.red("Error: ") + stderr);
	}
}


/*
 * parseNpmList parse stdout to list
 * @params
 * stdout: string
 * returns list: []
 */
function parseNpmList(stdout) {
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
