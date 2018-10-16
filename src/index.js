/**
 * The main entry file for the module.
 *
 */

// local modules
const npmLocal = require('./npmLocal');

const npmRegistry = require('./npmRegistry');

const npmRecent = require('./npmRecent');


module.exports = {
    npmLocal,
    npmRegistry,
    npmRecent
};
