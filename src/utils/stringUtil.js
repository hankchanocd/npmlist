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
