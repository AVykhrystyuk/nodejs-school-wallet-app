'use strict';

const _ = require('lodash');

const ApplicationError = require('../../errors/application-error');

const postFields = ['amount'];

module.exports = async ctx => {
	const paymentData = _.pick(ctx.request.body, postFields);
	const cardId = Number(ctx.params.id);

	const card = await ctx.cardsRepository.get(cardId);
	if (!card) {
		throw new ApplicationError(`No card with id ${cardId}`, 404);
	}

	card.balance = (card.balance - paymentData.amount).toString();
	await ctx.cardsRepository.update(card);

	const newtransaction = {
		cardId,
		type: 'paymentMobile',
		data: '+7(952)37-97-37-2',
		time: new Date().toISOString(),
		sum: `-${paymentData.amount}`
	};

	const newTransaction = await ctx.transactionsRepository.add(newtransaction);
	ctx.status = 201;
	ctx.body = newTransaction;
};
