const {
	fetch
} = require('../../build/utils/promiseUtil');


describe('Test promiseUtil', () => {
	let npmUrlGenerator;
	beforeAll(() => {
		npmUrlGenerator = function(module) {
			return `https://registry.npmjs.org/${module}`;
		};
	});

	test('Test fetch() with working URL', async () => {
		let mockFetch = npmUrlGenerator('express');
		let data = JSON.parse(await fetch(mockFetch));
		expect(data).toBeTruthy();
	});

	test('Test fetch() with corrupted URL', async () => {
		let mockFetch = npmUrlGenerator('express-not-working');
		expect(fetch(mockFetch)).rejects.toMatch('error');
		expect(fetch(mockFetch)).resolves.toThrowError('Failed to load page, status code: ' + 404);
	});
});
