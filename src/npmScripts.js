/**
 * npmScripts.js returns scripts list
 *
 */

// Dependencies
const chalk = require('chalk');
const pkgInfo = require('pkginfo');
const cwd = process.cwd();
const {
	spawn
} = require('child_process');
const nfzf = require('node-fzf');
const iPipeTo = require('ipt');
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
			if (!scripts || scripts.length === 0) return;

			// Print
			scripts.forEach(i => console.log(i));
		},
		fuzzy() {
			if (!scripts || scripts.length === 0) return;

			return nfzf(scripts, async function (value) {
				try {
					// Clean key
					let head = value.split(' ')[0];
					value = StringUtil.getRidOfQuotationMarks(head);
					value = StringUtil.getRidOfColors(value);
					const runScript = spawn('npm', ['run', value]);

					runScript.stdout.on('data', data => {
						console.log(data.toString('utf8'));
					});
				} catch (err) {
					console.log(err, "Error building interactive interface");
				}
			});
		},
		ipt() {
			if (!scripts || scripts.length === 0) return;

			iPipeTo(scripts, {
					size: 20
				}).then(keys => {
					return keys.forEach(async function (key) {
						// Clean key
						let head = key.split(' ')[0];
						key = StringUtil.getRidOfColors(head);
						key = StringUtil.getRidOfQuotationMarks(key);

						const runScript = spawn('npm', ['run', key]);

						runScript.stdout.on('data', data => {
							console.log(data.toString('utf8'));
						});
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
	if (!name && !version && !scripts) { // Not a module, no package.json, therefore no values
		return [];
	}

	(function printTitle() {
		if (name) {
			if (version) {
				return console.log(chalk.blueBright(name + '@' + version));
			}
			return console.log(name);
		}
	})();

	if (!scripts || Object.keys(scripts).length == 0) { // Has package.json but no scripts
		console.log(chalk.blueBright('Module has no scripts'));
		return [];
	}

	// Hoist the common task commands to top
	let commonKeys = Object.keys(scripts).filter(i => i.includes('test') || i.includes('build') || i.includes('commit') || i.includes('watch')).sort();
	let restKeys = Object.keys(scripts).filter(i => !i.includes('test') && !i.includes('build') && !i.includes('commit') && !i.includes('watch')).sort();
	let keys = commonKeys.concat(restKeys);

	let list = keys.map(key => {
		let value = scripts[key] ? scripts[key] : '';
		return chalk.white(key + ' => ') + chalk.grey(value);
	});
	return list;
}
module.exports.parseNpmScripts = parseNpmScripts;
