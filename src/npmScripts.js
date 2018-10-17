/**
 * npmScripts.js returns scripts list
 *
 */

// Dependencies
const chalk = require('chalk');
const pkgInfo = require('pkginfo');
const cwd = process.cwd();
const iPipeTo = require('ipt');
const {
	exec
} = require('./utils/promiseUtil');
const StringUtil = require('./utils/stringUtil');


/*
 * npmScripts prints npm scripts
 * Has two options: default() and fuzzy()
 *
 */
module.exports = function npmScripts() {
	try {
		let pkg = {
			exports: {}
		};

		// Use pkgInfo to retrieve scripts from package.json
		pkgInfo(pkg, {
			dir: cwd,
			include: ["name", "version", "scripts"]
		});

		return {
			default () {
				// Print
				parseNpmScripts(pkg).forEach(i => console.log(i));
			},
			fuzzy() {
				iPipeTo(parseNpmScripts(pkg), {
						size: 20
					}).then(keys => {
						return keys.forEach(async function (key) {
							// Clean key
							let head = key.split(' ')[0];
							key = StringUtil.getRidOfColors(head);
							key = StringUtil.getRidOfQuotationMarks(key);

							let {
								stdout: result
							} = await exec(`npm run ${key}`);

							console.log(result);
						});
					})
					.catch(err => {
						console.log(err, "Error building interactive interface");
					});
			}
		};

	} catch (e) {
		console.log(chalk.redBright('package.json not found'));
	}
};


function parseNpmScripts({
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
		return key + chalk.white(' => ') + chalk.grey(value);
	});
}
