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
		execChildProcess('npm root -g', function (error, stdout, stderr) {
			if (error) {
				return console.log(chalk.red.bold.underline("exec error:") + error);
			}
			if (stdout) {
				listGlobalModulesByTime(stdout);
			}
			if (stderr) {
				return console.log(chalk.red("Error: ") + stderr);
			}
		});

	} catch (err) {
		console.log(chalk.redBright(err));
	}
};

function listGlobalModulesByTime(stdout) {
	// Use path to parse the given path, and attach the following string so to avoid the `/node_modules/\n ` nasty bug
	const GLOBAL_MODULES_ALL = path.parse(stdout).dir + '/node_modules/*';
	const GLOBAL_MODULES_LIST = ls(GLOBAL_MODULES_ALL);

	let result = sortByDate(GLOBAL_MODULES_LIST).slice(0, 10).map((item) => {
		return {
			'name': item.name ? chalk.blueBright(item.name) : '',
			'time': item.stat.mtime ? parseDate(item.stat.mtime) : ''
		};
	});

	console.log(columnify(result));
}
