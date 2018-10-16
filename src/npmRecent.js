/**
 * npmRecent.js provides methods that present time-related info about npm packages
 *
 */
'use strict';

// Dependencies
const ls = require('ls');
const chalk = require('chalk');
const columnify = require('columnify');
const {
	sortByDate,
	parseDate
} = require('./utils/dateUtil');

// a list of global node modules
const GLOBAL_MODULES_LIST = ls('/usr/local/bin/lib/node_modules/*');


/*
 * npmRecent.js has only one exposed function
 */
module.exports = function () {
	try {
		const result = sortByDate(GLOBAL_MODULES_LIST).slice(0, 10).map((item) => {
			return {
				'name': item.name ? item.name : '',
				'time': item.stat.mtime ? parseDate(item.stat.mtime) : ''
			};
		});
		console.log(columnify(result));

	} catch(err) {
		console.log(chalk.redBright(err));
	}
};
