/**
 * npmRegistry.js fetches package dependencies and others infos from npm registry
 * It uses chain operations that are divided into 2 categories: simple() and all()
 *
 */
"use strict";

// Dependencies
const chalk = require("chalk");
const ui = require("cliui")();
const columnify = require("columnify");
const { fetch } = require("./utils/promiseUtil");
const StringUtil = require("./utils/stringUtil");

/*
 * npmRegistry has only one exposed export function.
 * It has two dimensions for output: simple() and all(), default().
 * Chain operations are flexible for future expansion with backward compatibility
 *
 */
module.exports.main = async function(module = "") {
	if (!module) {
		throw chalk.redBright("No module provided");
	}

	let data;
	try {
		data = JSON.parse(await fetch(`https://registry.npmjs.org/${module}`));
	} catch (err) {
		console.log(chalk.redBright(err));
		process.exit(1); // Abort early if fetching fails
	}

	// First-level chain operation has simple() and all()
	return {
		simple() {
			let list = parseToList(data).simple();

			// Second-level chain operation has default(), raw(), rawNoColor()
			return {
				default() {
					if (!list || list.length === 0) return;

					return list.forEach(i => console.log(i));
				},

				raw: async function() {
					if (!list || list.length === 0) return;

					return list;
				},

				rawNoColor: async function() {
					if (!list || list.length === 0) return;

					return list.map(key => {
						let result = StringUtil.getRidOfColors(key);
						result = StringUtil.getRidOfQuotationMarks(result);
						return result;
					});
				}
			};
		},
		all() {
			let list = parseToList(data).all();
			list.forEach(i => console.log(i));
		}
	};
};

/*
 * Parsing with 2 options: simple() offers lazy evaluation, all() evaluates all defined rules
 */
function parseToList(
	data = {
		name: "",
		"dist-tags": {
			latest: ""
		},
		versions: {}
	}
) {
	if (!data["name"] || !data["dist-tags"] || !data["versions"]) {
		throw new Error("Fetched info is incomplete, therefore useless");
	}

	const title = data["name"] + "@" + data["dist-tags"]["latest"];
	const versions = Object.keys(data.versions);
	const dependencies = (() => {
		let latestVersion = versions[versions.length - 1];
		return data.versions[latestVersion].dependencies; // List only the dependencies from that latest release
	})();

	// Chain operation has simple() and all()
	return {
		simple() {
			if (!dependencies) {
				console.log(chalk.blueBright(`${title} has no dependencies`));
				return;
			}
			console.log(chalk.blueBright(`${title}'s Dependencies:`));

			return Object.keys(dependencies).map(key => {
				let value = dependencies[key]
					? dependencies[key].replace(/[^0-9.,]/g, "")
					: "";
				return "├── " + key + "@" + chalk.grey(value);
			});
		},
		all() {
			console.log(chalk.blueBright(title));
			ui.div(
				{
					text: columnify(dependencies),
					width: 30,
					padding: [0, 2, 0, 2]
				},
				{
					text: columnify(versions),
					width: 25,
					padding: [0, 2, 0, 2]
				}
			);

			return ui.toString().split("\n");
		}
	};
}
module.exports.parseToList = parseToList;
