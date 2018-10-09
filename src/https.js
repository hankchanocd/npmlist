/**
 * https.js fetches lists of module dependencies from npm registry
 *
 */
'use strict';

// Dependencies
const chalk = require('chalk');
const columnify = require('columnify');
const https = require('https');


module.exports.fetchModuleInfo = function (module) {
    https.get(`https://registry.npmjs.org/${module}`, (res) => {
        if (res.statusCode !== 200) {
            res.destroy();
            console.log(chalk.redBright('Registry returned ' + res.statusCode));
            return;
        }

        let buffers = [];
        res.on('data', buffers.push.bind(buffers));
        res.on('end', function () {
            let data = Buffer.concat(buffers);
            const versions = Object.keys(JSON.parse(data).versions);
            const latestVersion = versions[versions.length - 1];
            const dependencies = JSON.parse(data).versions[latestVersion].dependencies;

            if (dependencies) {
                console.log(chalk.blueBright(`${module}'s dependencies:`));
                console.log(columnify(dependencies, {
                    columns: ['MODULE', 'VERSION']
                }));
            } else {
                console.log(chalk.blueBright(`${module} has no dependencies`));
            }
        });
    });
};
