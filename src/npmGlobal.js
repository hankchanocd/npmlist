'use strict';

// Dependencies
const pkgInfo = require('pkginfo');
const chalk = require('chalk');
const columnify = require('columnify');
const listToColumns = require('cli-columns');
const iPipeTo = require('ipt');
const {
	exec
} = require('./utils/promiseUtil');
const StringUtil = require('./utils/stringUtil');
const npmRoot = require('./npmRoot');


/*
 * npmGlobal() has only one exposed function that returns chain operations.

 * i.e. npmGlobal().simple().print();
 * i.e. npmGlobal().simple().fuzzy();
 * i.e. npmGlobal().details()
*/
module.exports = async function () {
	let list = (await npmRoot()).getAllModulesPaths();

	return { // First-level chain operations
		simple() {
			list = traversePackageJson(list, ["name", "version"]);
			list = retrieveModuleInfo(list).simple();
			list = columnify(list, {
				maxWidth: 60,
				preserveNewLines: true
			}).split('\n');

			return { // Second-level chain operation returns print() and fuzzy()
				print: function () {
					console.log(list.shift()); // Print and get rid of title
					list = list.map(i => StringUtil.truncate(i, 60, false));

					// Break the list into multiple lists that span the entire terminal width
					return console.log(listToColumns(list, {
						sort: false, // Reject the use of default alphabetic sorting by cli-columns
						padding: 0
					}));
				},

				fuzzy: async function () {
					try {
						let keys = await iPipeTo(list, {
							size: 20
						});

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
							} = await exec(`npm info ${key}`);

							console.log(result);
						});

					} catch (err) {
						console.log(err, "Error building interactive interface");
					}
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
				preserveNewLines: true
			}).split('\n'); // Convert the gigantic columnified string into a list
			console.log(list.shift()); // Print and get rid of title

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

				// Style output
				let result = chalk.blueBright('├── ' + name) + chalk.grey('@' + version);

				return {
					module: result
				};
			});
		},

		details(config = {
			maxWidth: 50
		}) {
			return list.map(pkg => {
				// Destructuring
				let {
					exports: {
						homepage,
						name,
						description,
						repository: {
							url
						},
						version
					}
				} = pkg;

				// Data cleansing
				let maxWidth = config.maxWidth;
				description = StringUtil.truncate(description, maxWidth);
				homepage = homepage.split('://')[1];
				url = url.split('://')[1];
				url = StringUtil.truncate(url, maxWidth);

				// Style output
				let result = chalk.blueBright('├── ' + name) + chalk.grey('@' + version) + '\n' +
					chalk.white('│   ' + description) + '\n';
				result += chalk.grey('│   ' + homepage + '\n' + '│   ' + url + '\n' + '│   ');

				return {
					module: result
				};
			});
		}
	};
}