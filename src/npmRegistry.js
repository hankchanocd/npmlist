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
const iPipeTo = require('ipt');
const {
	fetch,
	exec
} = require('./utils/promiseUtil');
const StringUtil = require('./utils/stringUtil');


/*
 * npmRegistry has only one exposed export function.
 * It has two dimensions of two options for output: simple() and all(), default() and fuzzy().
 * Chain operations are flexible for future expansion with backward compatibility
 *
 */
module.exports.main = async function (module = '') {
	if (!module) {
		return console.log(chalk.redBright('No module provided'));
	}

	let data;
	try {
		data = JSON.parse(await fetch(`https://registry.npmjs.org/${module}`));

	} catch (err) {
		console.log(chalk.redBright(err));
	}

	// First-level chain operation has simple() and all()
	return {
		simple() {
			let result = parseToList(data).simple();

			// Second-level chain operation has default() and fuzzy()
			return {
				default () {
					return result.forEach(i => console.log(i));
				},
				fuzzy() {
					return iPipeTo(result, {
							size: 20
						}).then(keys => {
							return keys.forEach(async function (key) {
								let cleansedKey = (function () {
									let tail = key.split(' ')[1];
									let result = StringUtil.getRidOfColors(tail);
									result = StringUtil.getRidOfQuotationMarks(result);
									return result;
								})();
								let {
									stdout: result
								} = await exec(`npm info ${cleansedKey}`);

								console.log(result);
							});
						})
						.catch(err => {
							console.log(err, "Error building interactive interface");
						});
				}
			};

		},
		all() {
			let result = parseToList(data).all();
			result.forEach(i => console.log(i));
		}
	};
};


/*
 * Parsing with 2 options: simple() offers lazy evaluation, all() evaluates all defined rules
 */
function parseToList(data = {
	'name': '',
	'dist-tags': {
		'latest': ''
	},
	'versions': {}
}) {
	if (!data['name'] || !data['dist-tags'] || !data['versions']) {
		throw new Error('Fetched info is incomplete, therefore useless');
	}

	const title = data['name'] + '@' + data['dist-tags']['latest'];
	const versions = Object.keys(data.versions);
	const dependencies = (() => {
		let latestVersion = versions[versions.length - 1];
		return data.versions[latestVersion].dependencies; // List only the dependencies from that latest release
	})();


	// Chain operation has simple() and all()
	return {
		simple() {
			if (!dependencies) {
				console.log(chalk.blueBright(`${title} has no dependencies`));
				return;
			}
			console.log(chalk.blueBright(`${title}'s Dependencies:`));

			return Object.keys(dependencies).map(key => {
				let value = dependencies[key] ? dependencies[key].replace(/[^0-9.,]/g, "") : '';
				return '├── ' + key + '@' + chalk.grey(value);
			});
		},
		all() {
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

			return ui.toString().split('\n');
		}
	};
}
module.exports.parseToList = parseToList;
