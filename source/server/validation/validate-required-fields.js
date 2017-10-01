'use strict';

module.exports = (obj, requiredFields) => {
    const missingFields = requiredFields.filter(field => !obj.hasOwnProperty(field));
    return missingFields;
}