/**
 * We DO NOT test main function that directly deals with the command line UI.
 * Only the supporting function that collecting and processing the data.
 *
 */

const chalk = require('chalk');
const {
	collectDependencies,
	parseListFromPkgOutput
} = require('./../../build/npmDependencies');


describe('Test npmDependencies.collectDependencies()', () => {
	test('Returns a valid data object', () => {
		let pkg = collectDependencies();
		let {
			exports: {
				name,
				version,
				dependencies,
				devDependencies
			}
		} = pkg;
		expect(name).toBeDefined();
		expect(version).toBeDefined();
		expect(dependencies).toBeDefined();
		expect(devDependencies).toBeDefined();
	});
});


describe('Test npmDependencies.parseListFromPkgOutput()', () => {
	let mockPkg;
	let mockInvalidPkg;
	beforeAll(() => {
		mockPkg = {
			exports: {
				name: 'surl-cli',
				version: '1.0.0',
				dependencies: {
					"bitly": "^6.0.8",
					"chalk": "^2.4.1"
				},
				devDependencies: {
					"opn-cli": "^1.1.1"
				}
			}
		};
		mockInvalidPkg = {
			exports: {}
		};
	});

	test('Returns a valid list', () => {
		let list = parseListFromPkgOutput(mockPkg);
		let supposedDependency = "bitly@" + chalk.grey("6.0.8");
		expect(list).toContain(supposedDependency);
		expect(list).toHaveLength(5);
    });

    test('Returns early if data invalid', () => {
        let list = parseListFromPkgOutput(mockInvalidPkg);
        expect(list).toBeUndefined();
    });
});


describe('Test npmDependencies.parseNpmListFromStdout()', () => {
	test('Returns a valid data object', () => {
	});
});
