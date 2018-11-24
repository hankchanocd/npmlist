/**
 * npmSearch.js searches for npm modules via npms.io, a better npm search index
 *
 */
'use strict';

// Dependencies
const chalk = require('chalk');
const {
	fetch
} = require('./utils/promiseUtil');
const StringUtil = require('./utils/stringUtil');


/*
 * npmSearch has only one exposed export function.
 * It has four options for output: default(), raw(), rawNoColor().
 * Chain operations are flexible for future expansion with backward compatibility
 *
 */
module.exports.main = async function (modules = []) {
	if (modules.length == 0) {
		throw chalk.redBright('No module provided');
	}

	if (typeof modules[0] !== 'string') {
		throw chalk.redBright('Provided module is not in string format');
	}

	let dataList;
	try {
		let query = modules.join('+');
		dataList = JSON.parse(await fetch(`https://api.npms.io/v2/search/?q=${query}`));

		// Process data
		dataList = dataList['results'];
		dataList = sortByScore(dataList);
		dataList = dataList.map(i => toString(i));

	} catch (err) {
		console.log(chalk.redBright(err));
		process.exit(1); // Abort early if fetching fails
	}

	return {
		default () {
			if (!dataList || dataList.length === 0) return;

			return dataList.forEach(i => console.log(i));
		},

		raw: async function () {
			if (!dataList || dataList.length === 0) return;

			return dataList;
		},

		rawNoColor: async function () {
			if (!dataList || dataList.length === 0) return;

			return dataList.map(key => {
				let result = StringUtil.getRidOfColors(key);
				result = StringUtil.getRidOfQuotationMarks(result);
				return result;
			});
		}
	};
};


/*
 * Sort by {'score': {'final} }
 */
function sortByScore(list = []) {
	if (!list) throw new Error('List is not given');
	if (list.length === 1) return;

	list.sort(function (a, b) {
		if (!a.score || !b.score) throw new Error('List has no `score` property');
		if (!a.score.final || !b.score.final) throw new Error('List has no `final` property');

		let keyA = a.score.final,
			keyB = b.score.final;

		// Compare the 2 dates
		if (keyA < keyB) return 1;
		if (keyA > keyB) return -1;
		return 0;
	});
	return list;
}


/*
 * Parse an object into a string, i.e. {} => `1 Express@3.0.1 `
 */
function toString(data = {
	'package': {
		'name': '',
		'version': '',
		'keywords': []
	},
	'score': {
		'final': 0
	}
}) {
	if (!data['package']['name'] || !data['package']['version'] || !data['score']['final']) {
		throw new Error('Fetched info is incomplete, abort');
	}

	let score = chalk.green(Math.round(data['score']['final'] * 100));
	let name = chalk.blueBright(data['package']['name']);
	let version = chalk.white('@' + data['package']['version']);
	let module = name + version;
	let keywords = data['package']['keywords'] ? chalk.gray(data['package']['keywords'].join(' ')) : '';

	let title = score + ' ' + module + ' ' + keywords;
	return title;
}
module.exports.toString = toString;
