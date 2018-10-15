/**
 * https.js fetches lists of module dependencies from npm registry
 *
 */
'use strict';

// Dependencies
const chalk = require('chalk');
const {
    fetch
} = require('./lib/fetch');

/*
 * fetchModule has two options for output: simple() and all()
 */
module.exports.fetchModule = async function (module) {
    let response;
    try {
        response = await fetch(`https://registry.npmjs.org/${module}`);
        if (!response.status == 200) {
            throw Error('NPM registry returns' + response.status);
        }
    } catch(err) {
        console.err(err);
    }

    let result = {};
    result.module = module;
    result.dependencies = parseFetchedList(response);

    printFetchedList(result);
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
