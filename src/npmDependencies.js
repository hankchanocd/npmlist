/**
 * npmDependencies.js list dependencies
 *
 * Changelog:
 * 2018 Oct 17:
 * printNpmListFromExec() is stuck with handling the callback instead of using async /await because npm cli is
 * easy to blow up errors
 */
'use strict';

// Dependencies
const execChildProcess = require('child_process').exec;
const chalk = require('chalk');
const pkgInfo = require('pkginfo');
const cwd = process.cwd();
const iPipeTo = require('ipt');
const {
	exec
} = require('./utils/promiseUtil');
const StringUtil = require('./utils/stringUtil');


/*
 * Output npm list with 2 dimensions of 2 options provided: local() and global() &
 	default () and fuzzy()
 * i.e. npmList().local().fuzzy()
 *
 */
module.exports.npmList = function () {

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

		// Returns default() and fuzzy() options
		return {
			default () {
				// Print
				parseListFromPkgOutput(pkg).forEach(i => console.log('├── ' + i));
			},
			fuzzy() {
				iPipeTo(parseListFromPkgOutput(pkg), {
						size: 20
					}).then(keys => {
						return keys.forEach(async function (key) {
							key = StringUtil.getRidOfColors(key);
							let {
								stdout: result
							} = await exec(`npm info ${key}`);

							console.log(result);
						});
					})
					.catch(err => {
						console.log(err, "Error building interactive interface");
					});
			}
		};

	} catch (e) {
		console.log("No package.json found");
	}
};


/**
 * Run `npm list --long=true`
 */
module.exports.npmListDetails = function () {
	const cmd = 'npm ll --depth=0 --long=true ';

	// We are stuck with handling the callback instead of using async /await because npm cli is easy to blow up errors
	execChildProcess(cmd + '--local', function (error, stdout, stderr) {
		if (error) { // Don't return if erred for `npm ERR! peer dep missing:` might occur, which is normal
			console.log(chalk.red.bold.underline("exec error:") + error);
		}
		if (stdout) {
			let list = parseNpmListFromStdout(stdout);
			return list.forEach(i => {
				console.log(i);
			});
		}
		if (stderr) {
			return console.log(chalk.red("Error: ") + stderr);
		}
	});
};


/*
 * Parse pkg object into a list
 *
 */
function parseListFromPkgOutput({
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
		list = list.concat(objectToList(dependencies));
	}

	if (devDependencies) {
		list.push((chalk.underline('DevDependencies')));
		list = list.concat(objectToList(devDependencies));
	}

	return list;


	/*
	 * Converts the deps object to list
	 * @params
	 * deps: {}
	 *
	 * returns []
	 */
	function objectToList(deps = {}) {
		return Object.keys(deps).map(key => {
			let value = deps[key] ? deps[key].replace(/[^0-9.,]/g, "") : '';
			return key + '@' + chalk.grey(value);
		});
	}
}


/*
 * parseNpmListFromStdout parse stdout to list
 * @params
 * stdout: string
 * returns list: []
 */
function parseNpmListFromStdout(stdout) {
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
