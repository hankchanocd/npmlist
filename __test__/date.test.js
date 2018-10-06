const {
    sortByDate,
    parseDate
} = require('./../src/lib/date');


test('parseDate(new Date()) returns the correct format', () => {
    let date = new Date();
    let month = date.getMonth() + 1; // month increments at 0
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    expect(parseDate(date)).toBe(`${month}-${day} ${hour}:${min}`);
});
