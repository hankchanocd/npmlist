const {
	sortByDate,
	parseDate
} = require('../../build/utils/dateUtil');


describe('sortByDate()', () => {
	let mockObjGenerator;
	beforeAll(() => {
		mockObjGenerator = function(dateString) {
			return {
				stat: {
					mtime: new Date(dateString)
				}
			};
		};
	});

	test('Sorts the list against the date correctly', () => {
		let mockList = [mockObjGenerator("1997-01-26"), mockObjGenerator("2015-01-26"), mockObjGenerator("2013-01-26")];
		let sortedList = sortByDate(mockList);

		expect(sortedList[0]).toEqual(mockObjGenerator("2015-01-26")); // Latest date comes first
		expect(sortedList[2]).toEqual(mockObjGenerator("1997-01-26"));
	});

	test('Do not sort if dates are the same', () => {
		let mockList = [mockObjGenerator("2015-01-26"), mockObjGenerator("2015-01-26")];
		expect(sortByDate(mockList)).toEqual(mockList);
	});

	test('Throws error if the give list does not have the right data format', () => {
		let mockStandardObj = mockObjGenerator("2015-01-26");
		let mockCorruptStatObj = {
			corrupt: {
				mtime: new Date("2015-01-26")
			}
		};
		let mockCorruptMtimeObj = {
			stat: {
				corrupt: new Date("2015-01-26")
			}
		};

		expect(sortByDate).toThrow('List is not given');
		expect(sortByDate([mockStandardObj])).toBeUndefined();

		// Error behaviors test must be wrapped in an anonymous function
		expect(() => {
			sortByDate([mockStandardObj, mockCorruptStatObj]);
		}).toThrow('List has no `stat` property');
		expect(() => {
			sortByDate([mockStandardObj, mockCorruptMtimeObj]);
		}).toThrow('List has no `mtime` property');
	});
});


describe('parseDate()', () => {
	test('current year returns the correct format: month-day hour:min', () => {
		let date = new Date();
		let month = date.getMonth() + 1; // month increments at 0
		let day = date.getDate();
		let hour = date.getHours();
		let min = date.getMinutes();
		expect(parseDate(date)).toBe(`${month}-${day} ${hour}:${min}`);
	});

	test('previous years return the correct format: month-day hour:min, year', () => {
		let date = new Date("2017-01-26");
		let month = date.getMonth() + 1; // month increments at 0
		let day = date.getDate();
		let hour = date.getHours();
		let min = date.getMinutes();
		expect(parseDate(date)).toBe(`${month}-${day} ${hour}:${min}, ${date.getFullYear()}`);
	});

	test('`xxx` returns `Invalid Date` Error', () => {
		expect(() => {
			parseDate('xxx');
		}).toThrow('Invalid Date');
	});
});
