/**
 * npmScripts.js returns scripts list
 *
 */

// Dependencies
const chalk = require('chalk');
const pkgInfo = require('pkginfo');
const cwd = process.cwd();


/*
 * Print npm scripts
 */
module.exports = function () {
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
