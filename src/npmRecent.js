/**
 * time.js provides methods that deal with time-related info
 *
 */
'use strict';

// Dependencies
const ls = require('ls');
const columnify = require('columnify');
const {
	sortByDate,
	parseDate
} = require('./utils/dateUtil');

// a list of globally installed node modules
const list = ls('/usr/local/bin/lib/node_modules/*');


/*
 * npmRecent.js has only one exposed function
 */
module.exports = function () {
	const result = sortByDate(list).slice(0, 10).map((item) => {
		return {
			'name': item.name,
			'time': parseDate(item.stat.mtime)
		};
	});
	console.log(columnify(result));
};
