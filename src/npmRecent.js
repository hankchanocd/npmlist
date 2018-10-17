/**
 * npmRecent.js provides methods that present time-related info about npm packages
 *
 */
'use strict';

// Dependencies
const execChildProcess = require('child_process').exec;
const ls = require('ls');
const path = require('path');
const chalk = require('chalk');
const columnify = require('columnify');
const {
	sortByDate,
	parseDate
} = require('./utils/dateUtil');


/*
 * npmRecent.js has only one exposed function
 */
module.exports = function () {
	try {
		// Find the path to global modules on user's machine
		execChildProcess('npm root -g', function (error, stdout, stderr) {
			if (error) {
				return console.log(chalk.red.bold.underline("exec error:") + error);
			}
			if (stdout) {
				let root = stdout;
				let list = getGlobalModulesList(root).recentTen();
				// print
				console.log(columnify(list));
			}
			if (stderr) {
				return console.log(chalk.red("Error: ") + stderr);
			}
		});

	} catch (err) {
		console.log(chalk.redBright(err));
	}
};

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

	return {
		all() {
			return sortByDate(finalList).map((item) => {
				return {
					'name': item.name ? chalk.blueBright(item.name) : '',
					'time': item.stat.mtime ? parseDate(item.stat.mtime) : ''
				};
			});
		},
		recentTen() {
			return sortByDate(finalList).slice(0, 10).map((item) => {
				return {
					'name': item.name ? chalk.blueBright(item.name) : '',
					'time': item.stat.mtime ? parseDate(item.stat.mtime) : ''
				};
			});
		}
	};
}
