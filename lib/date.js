module.exports = {

    // Sort by date descendingly
    sortByDate: function (arr) {
        arr.sort(function (a, b) {
            var keyA = new Date(a.stat.mtime),
                keyB = new Date(b.stat.mtime);

            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        });
        return arr;
    },

    // Parse date into MM:DD HH:MM format
    parseDate: function (str) {
        let date = new Date(str);
        return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }
};