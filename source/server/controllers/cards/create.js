'use strict';

const _ = require('lodash');

const ApplicationError = require('../../errors/application-error');
const {
	CardValidator
} = require('../../validation');

const cardValidator = new CardValidator();
const postFields = ['cardNumber', 'balance'];

module.exports = async ctx => {
	const card = _.pick(ctx.request.body, postFields);

	const validationErrors = cardValidator.validate(card);
	if (validationErrors.length) {
		throw new ApplicationError(validationErrors[0], 400);
	}

	card.balance = card.balance || 0;

	const newCard = await ctx.cardsRepository.add(card);
	ctx.status = 201;
	ctx.body = newCard;
};
