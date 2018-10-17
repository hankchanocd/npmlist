/**
 * promiseUtil.js is a small library that promisifies the following:
 * - https library
 * - child_process library
 *
 * so we don't have to import yet another external NPM dependencies
 *
 * ref: [https] https: //www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
 * ref: [child_process] https: //gist.github.com/miguelmota/e8fda506b764671745852c940cac4adb
 */

// Dependencies
const util = require('util');
const execChildProcess = require('child_process').exec;

/*
 * Fetch from a given url
 * @params
 * url: String
 *
 * example: fetch(url)
 */
module.exports.fetch = function(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err));
    });
};

/*
 * Execute cli command
 * @params
 * cmd: String
 *
 * example: exec(cmd);
 */
module.exports.exec = util.promisify(execChildProcess);
