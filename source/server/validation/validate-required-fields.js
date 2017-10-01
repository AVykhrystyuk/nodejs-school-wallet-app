'use strict';

module.exports = (obj, requiredFields) => {
	const missingFields = requiredFields.filter(field => !Object.prototype.hasOwnProperty.call(obj, field));
	return missingFields;
};
