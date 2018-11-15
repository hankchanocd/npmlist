'use strict';

// Dependencies
const pkgInfo = require('pkginfo');
const chalk = require('chalk');
const columnify = require('columnify');
const listToColumns = require('cli-columns');
const iPipeTo = require('ipt');
const {
	spawn
} = require('child_process');
const StringUtil = require('./utils/stringUtil');
const npmRoot = require('./npmRoot');


/*
 * npmGlobal() has only one exposed function that returns chain operations.

 * i.e. (await npmGlobal()).simple().print();
 * i.e. (await npmGlobal()).simple().fuzzy();
 * i.e.(await npmGlobal()).simple().raw();
 * i.e. (await npmGlobal()).details()
 *
 * The default value for 'global' is true, unless specified otherwise
*/
module.exports.main = async function (global = true) {
	let list = (await npmRoot(global)).getAllModulesPaths();

	return { // First-level chain operations
		simple() {
			list = traversePackageJson(list, ["name", "version"]);
			list = retrieveModuleInfo(list).simple();
			list = columnify(list, {
				truncate: true,
				config: {
					module: {
						maxWidth: 50
					}
				},
				preserveNewLines: true,
				showHeaders: false
			}).split('\n');

			return { // Second-level chain operation returns print() and fuzzy()
				print: function () {
					if (!list || list.length === 0) return;

					list = list.map(i => StringUtil.truncate(i, 60, false));

					// Break the list into multiple lists that span the entire terminal width
					return console.log(listToColumns(list, {
						sort: false, // Reject the use of default alphabetic sorting by cli-columns
						padding: 0
					}));
				},

				fuzzy: async function () {
					if (!list || list.length === 0) return;

					try {
						let keys = await iPipeTo(list, {
							size: 20,
							autocomplete: true,
							message: ' '
						});

						let cleansedKeys = (function cleanKeys() {
							return keys.map(key => {
								let tail = key.split(' ')[1];
								key = StringUtil.getRidOfColors(tail);
								key = StringUtil.getRidOfQuotationMarks(key);
								key = StringUtil.cleanTagName(key);
								return key;
							});
						})();

						return cleansedKeys.forEach(function (key) {
							spawn(`npm info ${key} | less -r`, {
								stdio: 'inherit',
								shell: true
							});
						});

					} catch (err) {
						console.log(err, "Error building interactive interface");
					}
				},


				/***** For API use *****/
				raw: async function () {
					if (!list || list.length === 0) return;

					return list;
				},

				rawNoColor: async function () {
					if (!list || list.length === 0) return;

					return list.map(key => {
						let tail = key.split(' ')[1];
						let result = StringUtil.getRidOfColors(tail);
						result = StringUtil.getRidOfQuotationMarks(result);
						return result;
					});
				}
			};
		},

		details() {
			// Layout outlook
			// ├── ghcal@2.3.10                                              │   github.com/hankchanocd/surl-cli.git
			// │   See the GitHub contributions calendar of a user in...     │
			// │   github.com/IonicaBizau/ghcal                              ├── svg-term-cli@2.1.1
			// │   git@github.com/IonicaBizau/ghcal.git                      │   Share terminal sessions as razor-sharp animated SV...
			// │                                                             │   github.com/marionebl/svg-term-cli#readme
			// ├── git-iadd@1.0.0                                            │   github.com/marionebl/svg-term-cli.git
			// │   Git plugin that allows you to interactively select...     │
			// │   github.com/ruyadorno/git-iadd#readme                      ├── table-layout-cli@1.0.0
			// │   github.com/ruyadorno/git-iadd.git                         │   Format data in column or table layout on the comma...
			// │                                                             │   github.com/75lb/table-layout-cli#readme
			list = traversePackageJson(list, ["name", "description", "version", "repository", "homepage"]);
			list = retrieveModuleInfo(list).details();

			list = columnify(list, {
				truncate: false,
				config: {
					module: {
						minWidth: 50,
						maxWidth: 60
					}
				},
				preserveNewLines: true,
				showHeaders: false
			}).split('\n'); // Convert the gigantic columnified string into a list

			if (!list || list.length === 0) return;

			// Break the list into multiple lists that span the entire terminal width
			return console.log(listToColumns(list, {
				sort: false, // Reject the use of default alphabetic sorting by cli-columns
				padding: 15
			}));
		}
	};
};


/*
 * Pipe the incoming array to fuzzy search
 * @params
 * list: []
 * attributes: []
 *
 * returns list
 */
function traversePackageJson(list = [], attributes = ["name"]) {
	return list.map(module => {
		// Read Package.json data
		let pkg = {
			exports: {}
		};
		pkgInfo(pkg, {
			dir: module.path,
			include: attributes
		});

		return pkg;
	});
}
module.exports.traversePackageJson = traversePackageJson;


/*
 * Retrieve package details from traversePackageJson()
 * It has two ways of retrieving: simple() and details()
 *
 */
function retrieveModuleInfo(list = []) {
	return {
		simple() {
			return list.map(pkg => {
				// Destructuring
				let {
					exports: {
						name,
						version
					}
				} = pkg;

				return {
					module: chalk.blueBright('├── ' + name) + chalk.grey('@' + version)
				};
			});
		},

		details(config = {
			maxWidth: 50
		}) {
			return list.map(pkg => {
				// Destructuring (with default values)
				let {
					exports: {
						homepage = '',
						name = '',
						description = '',
						repository: {
							url = ''
						} = {},
						version = ''
					} = {}
				} = pkg;

				// Data cleansing
				try {
					let maxWidth = config.maxWidth;

					name = name ? name : 'undefined';
					if (description) {
						description = StringUtil.truncate(description, maxWidth);
					} else {
						description = 'undefined';
					}
					if (homepage) {
						homepage = homepage.includes('://') ? homepage.split('://')[1] : homepage;
					} else {
						homepage = 'undefined';
					}
					if (url) {
						url = url.includes('://') ? url.split('://')[1] : url;
						url = StringUtil.truncate(url, maxWidth);
					} else {
						url = 'undefined';
					}
				} catch (err) {
					console.log(chalk.redBright('Data destructuring and cleansing failed'));
				}

				// Style output
				let result = chalk.blueBright('├── ' + name + '@' + version) + '\n' +
					chalk.white('│   ' + description) + '\n';
				result += chalk.grey('│   ' + homepage + '\n' + '│   ' + url);

				return {
					module: result
				};
			});
		}
	};
}
module.exports.retrieveModuleInfo = retrieveModuleInfo;
