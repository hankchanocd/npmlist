const {
	getRidOfColors,
	getRidOfQuotationMarks,
	truncate
} = require('../../build/utils/stringUtil');
const chalk = require('chalk');


test('Test getRidOfColors', () => {
	let template = 'template';
	// Get rid of colors
	expect(getRidOfColors(chalk.red(template))).toBe(template);
	expect(getRidOfColors(chalk.grey(template))).toBe(template);

	// Get rid of colors in different order in the text
	expect(getRidOfColors(template + chalk.blue(template))).toBe(template + template);
});

test('Test getRidOfQuotationMarks', () => {
	let template = 'template';

	// Get rid of quotation marks in different order
	expect(getRidOfQuotationMarks(template + "\"")).toBe(template);
	expect(getRidOfQuotationMarks("\"" + template)).toBe(template);
	expect(getRidOfQuotationMarks("\"\"\"" + template)).toBe(template);
	expect(getRidOfQuotationMarks("\"" + template + "\"" + template + "\"" + template)).toBe(template + template + template);
});

test('Test truncate', () => {
	let template = 'five five five';

	expect(truncate(template, 10, false)).toBe('five five ');
	expect(truncate(template, 10, true)).toBe('five five ...');
	expect(truncate(template, 20)).toBe(template);
});
