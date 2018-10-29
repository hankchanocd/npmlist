/**
 * npmRecent.js provides methods that present time-related info about npm packages
 *
 */
'use strict';

// Dependencies
const columnify = require('columnify');
const listToColumns = require('cli-columns');
const iPipeTo = require('ipt');
const {
	exec
} = require('./utils/promiseUtil');
const StringUtil = require('./utils/stringUtil');
const npmRoot = require('./npmRoot');


/*
 *
 i.e.npmRecent().recentTwenty().fuzzy();
 * i.e.npmRecent().all().default();
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
 * secondLevelChainOperations deals with default() and fuzzy()
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

		fuzzy() {
			if (!list || list.length === 0) return;

			return iPipeTo(list, {
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
	};
}
