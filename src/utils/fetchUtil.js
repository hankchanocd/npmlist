/**
 * fetch.js is a small library that promisifies the https library, so we don't have to import yet another dependencies
 *
 * ref: https: //www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
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
