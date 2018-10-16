/**
 * https.js fetches lists of module info from npm registry
 * https.js uses chain operations that are divided into 2 categories: simple() and all()
 *
 */
'use strict';

// Dependencies
const chalk = require('chalk');
const ui = require('cliui')();
const columnify = require('columnify');
const {
	fetch
} = require('./utils/fetchUtil');


/*
 * npmRegistry has only one exposed export function.
 * It has two options for output: simple() and all(). Chain operations are flexible for future expansion with backward compatibility
 * p.s. Lesson learned: async/await and methods that use promise cannot return
 */
module.exports = function (module = '') {
	if (!module) {
		return console.log(chalk.redBright('No module provided'));
	}

	return {
		simple: async function () {
				try {
					let data = JSON.parse(await fetch(`https://registry.npmjs.org/${module}`));
					let result = parse(data).simple();
					print(result).simple();
				} catch (err) {
					console.log(chalk.redBright(err));
				}
			},
			all: async function () {
				try {
					let data = JSON.parse(await fetch(`https://registry.npmjs.org/${module}`));
					let result = parse(data).all();
					print(result).all();
				} catch (err) {
					console.log(chalk.redBright(err));
				}
			}
	};
};

/*
 * Parsing with 2 options: simple() offers lazy evaluation, all() evaluates all defined rules
 */
function parse(data = {
	'name': '',
	'dist-tags': {
		'latest': ''
	},
	'versions': {}
}) {
	if (!data['name'] || !data['dist-tags'] || !data['versions']) {
		return console.log(chalk.redBright('Fetched info is incomplete, therefore useless'));
	}

	const title = data['name'] + '@' + data['dist-tags']['latest'];
	const versions = Object.keys(data.versions);
	const dependencies = (() => {
		let latestVersion = versions[versions.length - 1];
		return data.versions[latestVersion].dependencies; // List only the dependencies from that latest release
	})();

	return {
		simple() {
			return {
				title,
				dependencies
			};
		},
		all() {
			return {
				title,
				versions,
				dependencies
			};
		}
	};
}


/*
 * Printing with 2 options: simple() and all()
 */
function print({
	title = '',
	dependencies = '',
	versions = ''
}) {

	return {
		simple() { // Simple mode
			if (!dependencies) {
				return console.log(chalk.blueBright(`${title} has no dependencies`));
			}

			console.log(chalk.blueBright(`${title}'s Dependencies:`));
			Object.keys(dependencies).forEach(key => {
				let value = dependencies[key] ? dependencies[key].replace(/[^0-9.,]/g, "") : '';
				return console.log('├── ' + key + '@' + chalk.grey(value));
			});
		},
		all() { // All mode
			console.log(chalk.blueBright(title));
			ui.div({
				text: columnify(dependencies),
				width: 30,
				padding: [0, 2, 0, 2]
			}, {
				text: columnify(versions),
				width: 25,
				padding: [0, 2, 0, 2]
			});
			console.log(ui.toString());
		}
	};
}
