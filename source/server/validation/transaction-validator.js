'use strict';

const validateRequiredFields = require('./validate-required-fields');

const allowedTypes = ['prepaidCard', 'paymentMobile', 'card2Card'];
const requiredFields = ['sum', 'type', 'data'];

class TransactionValidator {
	validate(transaction) {
		const errors = [];

		const missingFields = validateRequiredFields(transaction, requiredFields);
		if (missingFields.length) {
			errors.push(`No required fields: ${missingFields.join(', ')}`);
			return errors;
		}

		if (!allowedTypes.includes(transaction.type)) {
			errors.push(`Invalid transaction type: ${transaction.type}`);
		}

		if (transaction.time && !Date.parse(transaction.time)) {
			errors.push('Invalid transaction time');
		}

		return errors;
	}
}

module.exports = TransactionValidator;
