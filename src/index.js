/**
 * The main entry file for the module.
 *
 */

// local modules
const npmDependencies = require('./npmDependencies');

const npmScripts = require('./npmScripts');

const npmRegistry = require('./npmRegistry');

const npmRecent = require('./npmRecent');


module.exports = {
    npmDependencies,
    npmScripts,
    npmRegistry,
    npmRecent
};
