/**
 * The main entry file for the module.
 * It serves as the main filter the only expose functions that are necessary for reuse by the end users.
 *
 */

// local modules
const npmDependencies = require('./npmDependencies');

const npmScripts = require('./npmScripts').main;

const npmRegistry = require('./npmRegistry').main;

const npmRecent = require('./npmRecent');

const npmGlobal = require('./npmGlobal');


module.exports = {
    npmDependencies,
    npmScripts,
    npmRegistry,
    npmRecent,
    npmGlobal
};
