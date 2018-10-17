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
 * i.e. npmList().global().default()
 *
 */
module.exports.npmList = function () {

	// First-level returns local() and global() options
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


				// Second-level at local() returns default() and fuzzy() options
				return {
					default () {
						// Print
						parseListFromPkgOutput(pkg).forEach(i => console.log('├── ' + i));
					},
					fuzzy() {
						iPipeTo(parseListFromPkgOutput(pkg), {}).then(keys => {
								return keys.forEach(async function (key) {
									key = StringUtil.getRidOfColors(key);
									let {
										stdout: result
									} = await exec(`npm info ${key} | less`);

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
		},

		global() {
			return {
				default () {
					execChildProcess('npm list --depth=0 --global', function (error, stdout, stderr) {
						return getNpmListFromExec(error, stdout, stderr).print();
					});
				},

				fuzzy() {
					execChildProcess('npm list --depth=0 --global', function (error, stdout, stderr) {
						return getNpmListFromExec(error, stdout, stderr).fuzzy();
					});
				}
			};
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
				getNpmListFromExec(error, stdout, stderr).print();
			});
		},
		global() {
			execChildProcess(cmd + '--global', function (error, stdout, stderr) {
				getNpmListFromExec(error, stdout, stderr).print();
			});
		}
	};
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
 * getNpmListFromExec deals with the standard output from child_process callback
 *
 * Return two options: print() and fuzzy() at stdout
 *
 * We are stuck with handling the callback instead of using async/await because npm cli is easy to blow up errors
 */
function getNpmListFromExec(error, stdout, stderr) {
	if (error) { // Don't return if erred for `npm ERR! peer dep missing:` might occur, which is normal
		console.log(chalk.red.bold.underline("exec error:") + error);
	}
	if (stdout) {

		// Return print() and fuzzy()
		return {
			print: function () {
				return parseNpmListFromStdout(stdout).forEach(i => {
					console.log(i);
				});
			},

			fuzzy: async function () {
				try {
					let keys = await iPipeTo(parseNpmListFromStdout(stdout), {});

					let cleansedKeys = (function cleanKeys() {
						return keys.map(key => {
							let tail = key.split(' ')[1]; // ├── bitcoin => bitcoin
							key = StringUtil.getRidOfColors(tail); // ANSI code would prevent sending to `npm info`
							key = StringUtil.getRidOfQuotationMarks(key); // bitcoin" => bitcoin
							return key;
						});
					})();

					return cleansedKeys.forEach(async function (key) {
						let {
							stdout: result
						} = await exec(`npm info ${key} | less`);

						console.log(result);
					});

				} catch (err) {
					console.log(err, "Error building interactive interface");
				}
			}
		};
	}
	if (stderr) {
		return console.log(chalk.red("Error: ") + stderr);
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
