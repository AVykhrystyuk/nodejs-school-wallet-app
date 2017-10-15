'use strict';

const { ApplicationError } = require('../../errors');
const { validateRequiredFields } = require('../../validation');

const requiredFields = ['target', 'sum'];

module.exports = async ctx => {
	const missingFields = validateRequiredFields(ctx.request.body, requiredFields);
	if (missingFields.length) {
		throw new ApplicationError(`No required fields: ${missingFields.join(', ')}`, 400);
	}

	const { target, sum } = ctx.request.body;

	const cardId = Number(ctx.params.id);
	const amount = Number(sum);
	const withdrawInfo = {
		type: 'card2Card',
		data: {
			toCardId: target
		}
	};

	await ctx.cardTransferService.withdraw(cardId, amount, withdrawInfo);

	const refillInfo = {
		type: 'card2Card',
		data: {
			fromCardId: cardId
		}
	};
	const refillTransaction = await ctx.cardTransferService.refill(target, amount, refillInfo);

	ctx.status = 201;
	ctx.body = refillTransaction;
};
