/**
 * date.js deals with code that is time-related and date-related
 *
 */
'use strict';

// Sort by date descendingly
module.exports.sortByDate = function (arr) {
    arr.sort(function (a, b) {
        var keyA = new Date(a.stat.mtime),
            keyB = new Date(b.stat.mtime);

        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
    });
    return arr;
};

// Parse date into MM:DD HH:MM format
module.exports.parseDate = function (str) {
    let date = new Date(str);
    return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};