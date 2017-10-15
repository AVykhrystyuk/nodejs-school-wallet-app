'use strict';

const { ApplicationError } = require('../../errors');
const { validateRequiredFields } = require('../../validation');

const requiredFields = ['phoneNumber', 'sum'];

module.exports = async ctx => {
	const missingFields = validateRequiredFields(ctx.request.body, requiredFields);
	if (missingFields.length) {
		throw new ApplicationError(`No required fields: ${missingFields.join(', ')}`, 400);
	}

	const { phoneNumber, sum } = ctx.request.body;

	const cardId = Number(ctx.params.id);
	const amount = Number(sum);
	const transactionInfo = {
		type: 'paymentMobile',
		data: { phoneNumber }
	};
	const transaction = await ctx.cardTransferService.refill(cardId, amount, transactionInfo);

	ctx.status = 200;
	ctx.body = transaction;
};
