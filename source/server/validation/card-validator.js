'use strict';

const {
	isCardNumberValid
} = require('../libs/luhn-algorithm');
const validateRequiredFields = require('./validate-required-fields');

const requiredFields = ['cardNumber'];

class CardValidator {
	validate(card) {
		const errors = [];

		const missingFields = validateRequiredFields(card, requiredFields);
		if (missingFields.length) {
			errors.push(`No required fields: ${missingFields.join(', ')}`);
			return errors;
		}

		if (!isCardNumberValid(card.cardNumber)) {
			errors.push(`Card number is not valid: ${card.cardNumber}`);
			return errors;
		}

		return errors;
	}
}

module.exports = CardValidator;
