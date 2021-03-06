/**
 * We DO NOT test main function that directly deals with the command line UI.
 * Only the supporting function that collecting and processing the data.
 *
 */

const chalk = require('chalk');
const npmScripts = require('./../../build/npmScripts');
const {
	collectNpmScripts,
	parseNpmScripts
} = npmScripts;


describe('Test npmScripts.collectNpmScripts()', () => {
	test('Returns a valid data object', (done) => {
		let pkg = collectNpmScripts();
		let {
			exports: {
				name,
				version,
				scripts
			}
		} = pkg;
		expect(name).toBeDefined();
		expect(version).toBeDefined();
		expect(scripts).toBeDefined();
		done();
	});
});


describe('Test npmScripts.parseNpmScripts()', () => {
	// Set timeout well over the default 5000
	jest.setTimeout(8000);

	let list;
	beforeAll(() => {
		let mockPkg = (function generateMockPkg() {
			return {
				exports: {
					name: 'surl-cli',
					version: '1.0.0',
					scripts: {
						"test": "jest",
						"build": "babel",
						"commit": "commitizen",
						"coverage": "jest --coverage",
						"eslint": "eslint ."
					}
				}
			};
		})();
		list = parseNpmScripts(mockPkg);
	});

	test('Returns a valid list', (done) => {
		let supposedTestScript = chalk.white("test" + ' => ') + chalk.grey("jest");
		expect(list).toContain(supposedTestScript);
		expect(list).toHaveLength(5);
		done();
	});

	test('Returns a list with common tasks hoisted to the top', (done) => {
		expect((list[0])).toEqual(expect.stringContaining('build'));
		expect((list[1])).toEqual(expect.stringContaining('commit'));
		expect((list[2])).toEqual(expect.stringContaining('test'));
		expect((list[3])).toEqual(expect.stringContaining('coverage'));
		expect((list[4])).toEqual(expect.stringContaining('eslint'));
		done();
	});
});
