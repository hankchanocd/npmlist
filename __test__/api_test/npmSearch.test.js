/**
 * We DO NOT test main function that directly deals with the command line UI.
 * Only the supporting function that collecting and processing the data.
 *
 */

const npmSearch = require('./../../build/npmSearch');
const {
	toString
} = npmSearch;

describe('Test npmSearch.toString()', () => {
	let mockEmptyData;
	beforeAll(async () => {
		mockEmptyData = {
			'package': {
				'name': '',
				'version': '',
				'keywords': []
			},
			'score': {
				'final': 0
			}
		};
	});

	test('Empty data would throw an error', (done) => {
		expect(() => {
			toString(mockEmptyData);
		}).toThrow('Fetched info is incomplete, abort');
		done();
	});
});
