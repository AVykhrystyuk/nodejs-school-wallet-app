'use strict';

const { ApplicationError } = require('../../errors');
const { validateRequiredFields } = require('../../validation');

const requiredFields = ['sum', 'phoneNumber'];

const commission = 3;

module.exports = async ctx => {
	const missingFields = validateRequiredFields(ctx.request.body, requiredFields);
	if (missingFields.length) {
		throw new ApplicationError(`No required fields: ${missingFields.join(', ')}`, 400);
	}

	const { sum, phoneNumber } = ctx.request.body;

	const cardId = Number(ctx.params.id);
	const amount = Number(sum) + commission;
	const transactionInfo = {
		type: 'withdrawCard',
		data: { phoneNumber }
	};
	const transaction = await ctx.cardTransferService.withdraw(cardId, amount, transactionInfo);

	ctx.status = 201;
	ctx.body = transaction;
};
