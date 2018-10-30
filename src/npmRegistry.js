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
	fetch
} = require('./utils/promiseUtil');
const {
	spawn
} = require('child_process');
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
			let list = parseToList(data).simple();

			// Second-level chain operation has default() and fuzzy()
			return {
				default () {
					if (!list || list.length === 0) return;

					return list.forEach(i => console.log(i));
				},
				fuzzy() {
					if (!list || list.length === 0) return;

					return iPipeTo(list, {
							size: 20,
							autocomplete: true,
							message: ' '
						}).then(keys => {
							return keys.forEach(async function (key) {
								let cleansedKey = (function () {
									let tail = key.split(' ')[1];
									let list = StringUtil.getRidOfColors(tail);
									list = StringUtil.getRidOfQuotationMarks(list);
									return list;
								})();

								spawn(`npm info ${cleansedKey} | less`, {
									stdio: 'inherit',
									shell: true
								});
							});
						})
						.catch(err => {
							console.log(err, "Error building interactive interface");
						});
				}
			};

		},
		all() {
			let list = parseToList(data).all();
			list.forEach(i => console.log(i));
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
