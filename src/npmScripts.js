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
 * npmScripts' main entry to print npm scripts (the only method exposed to index.js)
 * Has two options: default() and fuzzy()
 *
 */
module.exports.main = function npmScripts() {
	let pkg = collectNpmScripts();
	let scripts = parseNpmScripts(pkg);

	return {
		default () {
			// Print
			scripts.forEach(i => console.log(i));
		},
		fuzzy() {
			iPipeTo(scripts, {
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
};


/*
 * Collect npm scripts using pkgInfo
 *
 */
function collectNpmScripts() {
	let pkg;
	try {
		pkg = {
			exports: {}
		};

		pkgInfo(pkg, { // Use pkgInfo to retrieve scripts from package.json
			dir: cwd,
			include: ["name", "version", "scripts"]
		});

	} catch (e) {
		console.log(chalk.redBright('package.json not found'));
	}
	return pkg;
}
module.exports.collectNpmScripts = collectNpmScripts;


/*
 * Parse the scripts collected from pkgInfo
 *
 */
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

	// Hoist the common task commands to top
	let commonKeys = Object.keys(scripts).filter(i => i.includes('test') || i.includes('build') || i.includes('commit') || i.includes('watch')).sort();
	let restKeys = Object.keys(scripts).filter(i => !i.includes('test') && !i.includes('build') && !i.includes('commit') && !i.includes('watch')).sort();
	let keys = commonKeys.concat(restKeys);

	let list = keys.map(key => {
		let value = scripts[key] ? scripts[key] : '';
		return key + chalk.white(' => ') + chalk.grey(value);
	});
	return list;
}
module.exports.parseNpmScripts = parseNpmScripts;
