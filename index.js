#!/usr/bin/env node --harmony

const ls = require('ls');
const columnify = require('columnify');

const list = ls('/usr/local/bin/lib/node_modules/*');

// Select only the latest 5 download packages
const result = sortByDate(list).slice(0, 5).map((item) => {
    return {'name': item.name, 'time': parseDate(item.stat.mtime)}});
console.log(columnify(result));

// Helper methods
// Sort by date descendingly
function sortByDate(arr) {
    arr.sort(function(a, b){
        var keyA = new Date(a.stat.mtime),
        keyB = new Date(b.stat.mtime);

        // Compare the 2 dates
        if(keyA < keyB) return 1;
        if(keyA > keyB) return -1;
        return 0;}
        );
    return arr;
}

function parseDate(str) {
    let date = new Date(str);
    return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}
