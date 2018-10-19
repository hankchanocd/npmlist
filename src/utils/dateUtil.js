/**
 * dateUtil.js deals with code that is time-related and date-related
 *
 */
'use strict';

// Sort the object {stat: {mtime}} against dates descendingly
module.exports.sortByDate = function (list) {
	if (!list) throw new Error('List is not given');
	if (list.length === 1) return;

	list.sort(function (a, b) {
		if (!a.stat || !b.stat) throw new Error('List has no `stat` property');
		if (!a.stat.mtime || !b.stat.mtime) throw new Error('List has no `mtime` property');

		let keyA = new Date(a.stat.mtime),
			keyB = new Date(b.stat.mtime);

		// Compare the 2 dates
		if (keyA < keyB) return 1;
		if (keyA > keyB) return -1;
		return 0;
	});
	return list;
};

// Parse date into (MM:DD HH:MM Year) format for output
module.exports.parseDate = function (str) {
	let date = new Date(str);

	// Check for invalid date
	if (isNaN(date.getTime())) throw new Error('Invalid Date');

	if (date.getFullYear() == new Date().getFullYear()) { // If it's the current year
		return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
	} else {
		return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}, ${date.getFullYear()}`;
	}
};
