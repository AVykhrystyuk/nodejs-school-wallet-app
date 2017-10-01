'use strict';

function isCardNumberValid(cardNumber) {
	const cardNumberString = typeof cardNumber === 'string' ? cardNumber : cardNumber.toString();
	const cardDigits = Array.from(cardNumberString).map(c => Number(c));
	return isCardDigitsValid(cardDigits);
}

function isCardDigitsValid(cardDigits) {
	let sum = 0;
	for (let i = 0; i < cardDigits.length; i++) {
		let digit = cardDigits[cardDigits.length - i - 1];
		if (i % 2 === 1) {
			digit *= 2;
		}
		sum += digit > 9 ? digit - 9 : digit;
	}
	return sum % 10 === 0;
}

module.exports = {
	isCardDigitsValid,
	isCardNumberValid
};
