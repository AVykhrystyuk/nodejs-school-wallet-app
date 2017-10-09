'use strict';

const _ = require('lodash');

const ApplicationError = require('../../errors/application-error');
const {
	TransactionValidator
} = require('../../validation');

const transactionValidator = new TransactionValidator();
const postFields = ['type', 'time', 'sum', 'data'];

module.exports = async ctx => {
	const transaction = _.pick(ctx.request.body, postFields);
	const cardId = Number(ctx.params.id);

	const card = await ctx.cardsRepository.get(cardId);
	if (!card) {
		throw new ApplicationError(`No card with id ${cardId}`, 404);
	}

	transaction.cardId = cardId;

	const validationErrors = transactionValidator.validate(transaction);
	if (validationErrors.length) {
		throw new ApplicationError(validationErrors[0], 400);
	}

	if (!transaction.time) {
		transaction.time = (new Date()).toISOString();
	}

	const newTransaction = await ctx.transactionsRepository.add(transaction);

	ctx.status = 201;
	ctx.body = newTransaction;
};
