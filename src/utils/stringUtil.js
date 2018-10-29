/*
 * stringUtil.js deals with string operations
 *
 */

// Get rid of color ANSI codes
module.exports.getRidOfColors = function (str) {
	return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
};

// Get rid of any quotation marks that might interfere with parsing
module.exports.getRidOfQuotationMarks = function (str) {
	return str.replace(/['"]+/g, '');
};

// Truncate
module.exports.truncate = function (str, maxWidth = 50, truncateMarker = true) {
	if (truncateMarker) {
		str = str.length > maxWidth ? str.substring(0, maxWidth) + '...' : str;
	} else {
		str = str.length > maxWidth ? str.substring(0, maxWidth) : str;
	}
	return str;
};

// Clean tag name
module.exports.cleanTagName = function(str) {
	if (str.includes('semantic')) {
		let moduleName = str.split('@')[0];
		return moduleName;
	}
	return str;
};
