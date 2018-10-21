/**
 * The main entry file for the module.
 * It serves as the main filter the only expose functions that are necessary for reuse by the end users.
 *
 */

// local modules
const {
	npmList,
	npmListDetails
} = require('./npmDependencies');
const npmDependencies = {
	npmList,
	npmListDetails
}; // Only the two main functions are exposed for export

const npmScripts = require('./npmScripts').main;

const npmRegistry = require('./npmRegistry').main;

const npmRecent = require('./npmRecent');

const npmGlobal = require('./npmGlobal').main;


module.exports = {
	npmDependencies,
	npmScripts,
	npmRegistry,
	npmRecent,
	npmGlobal
};
