/**
 * https.js fetches lists of module dependencies from npm registry
 *
 */
'use strict';

// Dependencies
const chalk = require('chalk');
const https = require('https');


module.exports.fetchModuleInfo = function (module) {
    https.get(`https://registry.npmjs.org/${module}`, (res) => {
        if (res.statusCode !== 200) {
            res.destroy();
            console.log(chalk.redBright('NPM Registry returned ' + res.statusCode));
            return;
        }

        let buffers = [];
        res.on('data', buffers.push.bind(buffers));
        res.on('end', function () {
            let result = {};
            result.module = module;
            result.dependencies = parseFetchedList(Buffer.concat(buffers));

            printFetchedList(result);
        });
    });
};

function parseFetchedList(data) {
    const versions = Object.keys(JSON.parse(data).versions);
    const latestVersion = versions[versions.length - 1];
    const result = JSON.parse(data).versions[latestVersion].dependencies;

    return result;
}

function printFetchedList(result) {
    let module = result.module ? result.module : '';
    let dep = result.dependencies ? result.dependencies : '';

    if (!dep) {
        return console.log(chalk.blueBright(`${module} has no dependencies`));
    }

    console.log(chalk.blueBright(`${module}'s Dependencies:`));
    Object.keys(dep).forEach(key => {
        let value = dep[key] ? dep[key].replace(/[^0-9.,]/g, "") : '';
        return console.log('├── ' + key + '@' + chalk.grey(value));
    });
}
