/**
 * We DO NOT test main function that directly deals with the command line UI.
 * Only the supporting function that collecting and processing the data.
 *
 */

const chalk = require('chalk');
const npmRegistry = require('./../../build/npmRegistry');
const {
	parseToList
} = npmRegistry;


describe('Test npmRegistry.parseToList() options', () => {
	let mockEmptyData;
	let mockWithoutDepsData;
	let mockFilledData;
	beforeAll(async () => {
		mockEmptyData = {
			'name': '',
			'dist-tags': {
				'latest': ''
			},
			'versions': {}
		};
		mockWithoutDepsData = {
			'name': 'surl-cli',
			'dist-tags': {
				'latest': '2.0.2'
			},
			'versions': {
				"1.0.0": {
					"name": "surl-cli",
					"version": "1.0.0"
				}
			}
		};
		mockFilledData = {
			'name': 'surl-cli',
			'dist-tags': {
				'latest': '2.0.2'
			},
			'versions': {
				"1.0.0": {
					"name": "surl-cli",
					"version": "1.0.0",
					"scripts": {
						"test": "mocha --timeout 5000",
						"build": "babel ./src -d ./build"
					},
					"dependencies": {
						"chalk": "^2.4.1",
						"clipboardy": "^1.2.3"
					},
					"devDependencies": {
						"expect.js": "^0.3.1",
						"mocha": "^5.2.0"
					}
				}
			}
		};
	});

	test('Empty data would throw an error', (done) => {
		expect(() => {
			parseToList(mockEmptyData);
		}).toThrowError('Fetched info is incomplete, therefore useless');
		done();
	});

	test('simple() returns a valid list', (done) => {
		let notDefined = parseToList(mockWithoutDepsData).simple();
		expect(notDefined).toBeUndefined();

		let list = parseToList(mockFilledData).simple();
		expect(list).toHaveLength(2);
		expect(list[0]).toEqual('├── ' + 'chalk' + '@' + chalk.grey('2.4.1'));
		done();
	});

	test('all() returns a result strings split in list', (done) => {
		let list = parseToList(mockFilledData).all();
		expect(list).toHaveLength(3); // With title
		done();
	});
});
