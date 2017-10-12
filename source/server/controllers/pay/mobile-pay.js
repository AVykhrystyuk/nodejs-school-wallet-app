'use strict';

const _ = require('lodash');

const ApplicationError = require('../../errors/application-error');

const postFields = ['amount', 'phoneNumber'];

module.exports = async ctx => {
	const {amount, phoneNumber} = _.pick(ctx.request.body, postFields);
	const cardId = Number(ctx.params.id);

	const card = await ctx.cardsRepository.get(cardId);
	if (!card) {
		throw new ApplicationError(`No card with id ${cardId}`, 404);
	}

	card.balance = (card.balance - amount).toString();
	await ctx.cardsRepository.update(card);

	const newTransaction = {
		cardId,
		type: 'paymentMobile',
		data: phoneNumber,
		time: new Date().toISOString(),
		sum: `-${amount}`
	};

	const createdTransaction = await ctx.transactionsRepository.add(newTransaction);
	ctx.status = 201;
	ctx.body = createdTransaction;
};
