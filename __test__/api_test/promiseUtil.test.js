const {
	fetch
} = require('../../build/utils/promiseUtil');


describe('Test promiseUtil', () => {
	// Set timeout well over the default 5000
	jest.setTimeout(8000);

	let npmUrlGenerator;
	beforeAll(() => {
		npmUrlGenerator = function (module) {
			return `https://registry.npmjs.org/${module}`;
		};
	});

	test('Test fetch() with working URL', async (done) => {
		let mockFetch = npmUrlGenerator('surl-cli');
		let data = JSON.parse(await fetch(mockFetch));
		expect(data).toBeTruthy();
		done();
	});

	test('Test fetch() with corrupted URL', async (done) => {
		let mockFetch = npmUrlGenerator('express-not-working');
		expect(fetch(mockFetch)).rejects.toMatch('error');
		expect(fetch(mockFetch)).resolves.toThrowError('Failed to load page, status code: ' + 404);
		done();
	});
});
