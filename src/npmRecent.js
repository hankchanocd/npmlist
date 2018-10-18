/**
 * npmRecent.js provides methods that present time-related info about npm packages
 *
 */
'use strict';

// Dependencies
const ls = require('ls');
const path = require('path');
const chalk = require('chalk');
const columnify = require('columnify');
const iPipeTo = require('ipt');
const {
	sortByDate,
	parseDate
} = require('./utils/dateUtil');
const {
	exec
} = require('./utils/promiseUtil');
const StringUtil = require('./utils/stringUtil');


/*
 * npmRecent.js has only one exposed function
 * It has two dimensions of two options, together as four combinations
 *
 * i.e. npmRecent().recentTwenty().fuzzy();
 * i.e. npmRecent().all().default();
 */
module.exports = async function () {
	let root;
	try {
		let {
			stdout,
			stderr
		} = await exec('npm root -g'); // Find the path to global modules on user's machine
		root = stdout;

		stderr ? console.log(chalk.redBright(stderr)) : '';
	} catch (err) {
		console.log(chalk.redBright(err));
	}

	// First-level chain operations
	return {
		recentTwenty() {
			let list = getGlobalModulesList(root).sortByDate().recentTwenty().build();
			return secondLevelChainOperation(list);
		},
		all() {
			let list = getGlobalModulesList(root).sortByDate().all().build();
			return secondLevelChainOperation(list);
		}
	};
};


/*
 * secondLevelChainOperations deals with default() and fuzzy()
 * Increase code reuse.
 *
 */
function secondLevelChainOperation(list = []) {
	return { // Second-level chain operations
		default () {
			return console.log(columnify(list));
		},
		fuzzy() {
			list = columnify(list).split('\n');

			console.log(list.shift()); // Print title
			return pipeToFuzzy(list);
		}
	};
}


/*
 * getGlobalModulesList
 * @param takes root path
 * returns two options: all() and recentTen()
 * p.s. We plan to use recentTen() only
 */
function getGlobalModulesList(root) {
	// Use path to parse the given path, and attach the following string so to avoid the `/node_modules/\n ` nasty bug
	const GLOBAL_MODULES_ALL = path.parse(root).dir + '/node_modules/*';
	let modulesList = ls(GLOBAL_MODULES_ALL);

	let finalList = (function traverseModulesList() {
		let list = [];
		let authorDirectories = modulesList.filter(module => module.file.includes('@')); // When module's starts with @, i.e. @username/module
		let withoutAuthorDirectories = modulesList.filter(module => !module.file.includes('@'));
		list = list.concat(withoutAuthorDirectories);

		// Traverse one step further into the directory
		authorDirectories.forEach(module => {
			let childModulesList = ls(module.full + '/*');
			childModulesList = childModulesList.map(module => {
				// Append the module name with its parent directory, i.e. module => @username/module
				module.name = path.parse(module.path).name + '/' + module.name;
				return module;
			});
			list = list.concat(childModulesList);
		});

		return list;
	})();

	return new ListBuilder(finalList);
}


/*
 * ListBuilder uses Builder pattern to create reusable chain operations the gives users the flexibility of
 * of choosing their custom list modifications.
 *
 */
class ListBuilder {
	constructor(list) {
		this.list = list;
	}

	all() {
		this.list = this.list.map(item => {
			return {
				'name': item.name ? chalk.blueBright(item.name) : '',
				'time': item.stat.mtime ? parseDate(item.stat.mtime) : ''
			};
		});
		return this;
	}

	recentTwenty() {
		this.list = this.list.slice(0, 20).map(item => {
			return {
				'name': item.name ? chalk.blueBright(item.name) : '',
				'time': item.stat.mtime ? parseDate(item.stat.mtime) : ''
			};
		});
		return this;
	}

	sortByDate() {
		this.list = sortByDate(this.list);
		return this;
	}

	build() {
		return this.list;
	}
}


/*
 * Pipe the incoming array to fuzzy search
 *
 */
function pipeToFuzzy(list = []) {
	iPipeTo(list, {
			size: 20
		}).then(keys => {
			return keys.forEach(async function (key) {
				// Clean key
				let cleansedKey = (function () {
					let head = key.split(' ')[0];
					let result = StringUtil.getRidOfColors(head);
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
