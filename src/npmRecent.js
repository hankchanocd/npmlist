/**
 * npmRecent.js list recent global installs.
 *
 */
'use strict';

// Dependencies
const columnify = require('columnify');
const listToColumns = require('cli-columns');
const StringUtil = require('./utils/stringUtil');
const npmRoot = require('./npmRoot');


/*
 * npmRecent.js has only one exposed export function.
 * i.e.npmRecent().all().default();
 * i.e.npmRecent().all().rawNoColor();
*/
module.exports = function () {

	// First-level chain operations
	return {
		recentTwenty: async function () {
			let list = (await npmRoot()).getRecentTwentyModules();
			return secondLevelChainOperation(list);
		},
		all: async function () {
			let list = (await npmRoot()).getAllModules();
			return secondLevelChainOperation(list);
		}
	};
};


/*
 * secondLevelChainOperations deals with default(), raw(), rawNoColor()
 * Increase code reuse.
 *
 */
function secondLevelChainOperation(list = []) {
	list = columnify(list, {
		showHeaders: false
	}).split('\n'); // Convert the gigantic columnified string into a list

	return { // Second-level chain operations
		default () {
			if (!list || list.length === 0) return;

			// Break the list into multiple lists that span the entire terminal width
			return console.log(listToColumns(list, {
				sort: false // Reject the use of default alphabetic sorting by cli-columns
			}));
		},

		raw: async function () {
			if (!list || list.length === 0) return;

			return list;
		},

		rawNoColor: async function () {
			if (!list || list.length === 0) return;

			return list.map(key => {
				let result = StringUtil.getRidOfColors(key);
				result = StringUtil.getRidOfQuotationMarks(result);
				return result;
			});
		}
	};
}
