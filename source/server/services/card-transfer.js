'use strict';

const {
	ApplicationError
} = require('../errors');

class CardTransferService {
	constructor(cardsRepository, transactionsRepository) {
		this.cardsRepository = cardsRepository;
		this.transactionsRepository = transactionsRepository;
	}

	async withdraw(cardOrId, sum, transactionInfo) {
		return this.refill(cardOrId, -sum, transactionInfo);
	}

	async refill(cardOrId, sum, transactionInfo) {
		const card = await this._resolveCard(cardOrId);
		card.balance += sum;
		await this.cardsRepository.update(card);

		const createdTransaction = await this.transactionsRepository.add({
			cardId: card.id,
			type: transactionInfo.type,
			data: transactionInfo.data,
			time: new Date().toISOString(),
			sum
		});

		return createdTransaction;
	}

	async _resolveCard(cardOrId) {
		if (typeof cardOrId === 'number') {
			const cardId = cardOrId;
			const card = await this.cardsRepository.get(cardId);
			if (!card) {
				throw new ApplicationError(`No card with id ${cardId}`, 404);
			}

			return card;
		}

		const card = cardOrId;
		if (!card) {
			throw new ApplicationError('Card is not provided', 400);
		}
		return card;
	}
}

module.exports = CardTransferService;
